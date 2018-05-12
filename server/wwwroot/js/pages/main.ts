import { IPage, IPageArgs } from "../pageLoader";
import MainContainer from "./main_html";
import { getPageElement, IPageElements, getPageElements } from "./pages";
import { months, IDatePeriod, toServerDate, getMonthPeriod } from "../dateParser";
import { getDaylyBudget, toFixedValue } from "./list";

export default class MainPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;
    private mainCurrentValue: HTMLDivElement;
    private mainExistValue: HTMLDivElement;
    constructor() {
        let div = getPageElement();
        div.innerHTML = MainContainer();

        this.pageElements = getPageElements(div);
        this.mainCurrentValue = this.pageElements.mainCurrentValue as HTMLDivElement;
        this.mainExistValue = this.pageElements.mainExistValue as HTMLDivElement;


        this.content = div;

    }

    private loadData(period: IDatePeriod) {
        let search = {
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        };
        let todayDate = toServerDate(new Date());

        return Promise.all([this.args.store.incoming.get(search),
            this.args.store.stableIncome.get(search),
            this.args.store.stableWaste.get(search),
            this.args.store.incoming.get({
                toDate: todayDate,
                fromDate: todayDate
            })
        ]).then(data => {
            let dailyBudget = getDaylyBudget(data[1], data[2]);
            let existToday = dailyBudget + data[3].reduce((prev, curr) => prev + curr.value, 0);

            let dayNumber = new Date().getDate();
            let total = this.args.getUser().lastValue + dayNumber * dailyBudget + data[0].reduce((prev, curr) => prev + curr.value, 0);

            return { existToday: toFixedValue(existToday), total: toFixedValue(total) };
        });
    }

    public focus(args: IPageArgs) {
        this.args = args;

        let date = new Date();

        this.pageElements.mainDateSpan.textContent = `${ date.getDate() } ${ months[date.getMonth()] } ${ date.getFullYear() }`;

        this.loadData(getMonthPeriod(new Date())).then(data => {
            let currency = this.args.getCurrency()[0];

            this.mainCurrentValue.textContent = `${ data.total } ${ currency.name }`;
            this.mainExistValue.textContent = `${ data.existToday } ${ currency.name }`;
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