import { IPage, IPageArgs } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import ListContainer, { getIncomingListRow } from "./list_html";
import { IDatePeriod, getMonthPeriod, toServerDate, parseServerDate, addDays, months, getLastDate } from "../dateParser";
import { IIncoming } from "../../../server/apiInstances/incomingApi";
import { ICurrency } from "../../../server/apiInstances/currencyApi";
import { IStableIncome } from "../../../server/apiInstances/stableIncome";
import { IStableWaste } from "../../../server/apiInstances/stableWaste";

interface IPageState {
    date?: string;
}

export interface IData {
    [key: string]: IIncoming[];
}

export interface ICurrencyObject {
    [key: number]: string;
}

const toFixedValue = (data: number) => parseFloat(data.toFixed(2));

const getDaylyBudget = (incoming: IStableIncome[], wasting: IStableWaste[]) => {
    let stableIncoming = incoming.reduce((res, curr) => res + curr.value, 0);
    let stableWaste = wasting.reduce((res, curr) => res + curr.value, 0);

    let days = getLastDate(new Date());

    let dailyBudget = (stableIncoming - stableWaste) / days;

    return toFixedValue(dailyBudget);
};

export { toFixedValue, getDaylyBudget };

export default class ListPage implements IPage {
    private content: HTMLDivElement;
    private pageElements: IPageElements;
    private listBlock: HTMLDivElement;
    private mainDateSpan: HTMLSpanElement;
    private args: IPageArgs;

    constructor() {
        let div = getPageElement();
        div.innerHTML = ListContainer();

        this.pageElements = getPageElements(div);
        this.listBlock = this.pageElements.listBlock as HTMLDivElement;
        this.mainDateSpan = this.pageElements.mainDateSpan as HTMLSpanElement;

        this.content = div;
    }

    private loadData(period: IDatePeriod) {
        let search = {
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        };

        return Promise.all([this.args.store.incoming.get(search).then(data => {
                data.sort((a, b) => a.date - b.date);

                let periodData = this.getDataForPeriod(period);

                for (let i = 0, len = data.length; i < len; i++) {
                    let item = data[i];
                    let date = item.date.toString();

                    if (periodData[date]) {
                        periodData[date].push(item);
                    }
                }

                return periodData;
            }),
            this.args.store.stableIncome.get(search),
            this.args.store.stableWaste.get(search)
        ]);
    }

    private getDataForPeriod(period: IDatePeriod) {
        let startUTC = toServerDate(period.fromDate);
        let endUTC = toServerDate(period.toDate);
        let result: IData = {};

        let currentDate = startUTC * 1;

        while (currentDate <= endUTC) {
            result[currentDate.toString()] = [];

            currentDate = toServerDate(addDays(parseServerDate(currentDate), 1));
        }

        return result;
    }

    private clearList() {
        this.listBlock.innerHTML = "";
    }

    private getDate(date: Date) {
        return `${ months[date.getMonth()] } ${ date.getFullYear() }`;
    }

    private getCurrencyObject(currency: ICurrency[]) {
        let res: ICurrencyObject = {};

        currency.forEach(value => {
            res[value.id] = value.name;
        });

        return res;
    }

    public focus(args: IPageArgs) {
        this.args = args;

        let state = args.getUrlState() as IPageState;
        let date = state.date ? new Date(state.date) : new Date();

        date = isNaN(date as any) ? new Date() : date;

        this.clearList();

        this.mainDateSpan.textContent = this.getDate(date);

        this.loadData(getMonthPeriod(date)).then(allData => {
            let dailyBudget = getDaylyBudget(allData[1], allData[2]);

            let incomingData = allData[0];
            let keys = Object.keys(incomingData);
            let rows = "";
            let getTotal = (incoming: IIncoming[]) => toFixedValue(incoming.reduce((res, curr) => res + curr.value, 0));

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let serverDate = parseInt(key);
                let incomingArr = [<IIncoming>{
                    comment: "Daily budget",
                    date: serverDate,
                    currencyId: 1,
                    value: dailyBudget,
                    isActive: 1,
                    typeId: 0,
                    tags: ""
                }].concat(incomingData[key]);

                rows += getIncomingListRow(incomingArr, parseServerDate(serverDate), getTotal(incomingArr), this.getCurrencyObject(args.getCurrency()));
            }

            this.listBlock.innerHTML = rows;
        }).catch(e => {
            let mess = e instanceof Error ? e.message : e.toString();
            alert(mess);
            console.error(e);
        });
    }

    public initialize() {

    }

    public blur() {

    }

    get node() {
        return this.content;
    }
}