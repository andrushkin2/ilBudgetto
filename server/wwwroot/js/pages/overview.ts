import { IPageArgs, IPage } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import OverviewContainer from "./overview_html";
import { IDatePeriod, toServerDate, getMonthPeriod, addMonths } from "../dateParser";
import { toFixedValue } from "./list";
import { IStableWaste } from "../../../server/apiInstances/stableWaste";


export default class OverviewGraphPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private overviewIncomeAll: HTMLDivElement;
    private overviewIncomeFixed: HTMLDivElement;
    private overviewIncomeVariable: HTMLDivElement;
    private overviewExpensesAll: HTMLDivElement;
    private overviewExpensesFixed: HTMLDivElement;
    private overviewExpensesVariable: HTMLDivElement;
    private overviewSavings: HTMLDivElement;
    private overviewLeftBunget: HTMLDivElement;

    constructor() {
        let div = getPageElement();
        div.innerHTML = OverviewContainer();

        this.pageElements = getPageElements(div);

        this.overviewIncomeAll = this.pageElements.overviewIncomeAll as HTMLDivElement;
        this.overviewIncomeFixed = this.pageElements.overviewIncomeFixed as HTMLDivElement;
        this.overviewIncomeVariable = this.pageElements.overviewIncomeVariable as HTMLDivElement;
        this.overviewExpensesAll = this.pageElements.overviewExpensesAll as HTMLDivElement;
        this.overviewExpensesFixed = this.pageElements.overviewExpensesFixed as HTMLDivElement;
        this.overviewExpensesVariable = this.pageElements.overviewExpensesVariable as HTMLDivElement;
        this.overviewSavings = this.pageElements.overviewSavings as HTMLDivElement;
        this.overviewLeftBunget = this.pageElements.overviewLeftBunget as HTMLDivElement;

        this.content = div;

    }

    private getSavingForPrevPeriod(period: IDatePeriod) {
        let search = {
            toDate: toServerDate(period.toDate)
        };

        return Promise.all([
            this.args.store.stableIncome.get(search),
            this.args.store.stableWaste.get(search),
            this.args.store.incoming.get(search)
        ]).then(data => {
            let reduceFunc = (prev: number, value: { value: number }) => prev + value.value;
            let reduceAbsFunc = (prev: number, value: IStableWaste) => prev + Math.abs(value.value);

            let incoming = data[2].reduce(reduceFunc, 0);
            let stableIncome = data[0].reduce(reduceFunc, 0);
            let stableWaste = data[1].reduce(reduceAbsFunc, 0);

            return stableIncome + incoming - stableWaste;
        });
    }

    private loadData2(date: Date) {
        let period = getMonthPeriod(date);
        let search = {
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        };

        let prevPeriod = getMonthPeriod(addMonths(date, -1));

        return Promise.all([
            this.args.store.incoming.get(search),
            this.args.store.stableIncome.get(search),
            this.args.store.stableWaste.get(search),
            this.getSavingForPrevPeriod(prevPeriod)
        ]).then(data => {
            let reduceAbsFunc = (prev: number, value: {value: number}) => prev + Math.abs(value.value);

            let incomingWaste = toFixedValue(data[0].filter(value => value.value < 0).reduce(reduceAbsFunc, 0));
            let incomingPlus = toFixedValue(data[0].filter(value => value.value >= 0).reduce(reduceAbsFunc, 0));

            let stableIncome = toFixedValue(data[1].reduce(reduceAbsFunc, 0));
            let stableWaste = toFixedValue(data[2].reduce(reduceAbsFunc, 0));

            let left = toFixedValue(stableIncome + incomingPlus - stableWaste - incomingWaste);
            let savings = toFixedValue(data[3] + left);

            return { stableIncome, stableWaste, incomingWaste, incomingPlus, savings, left };
        });
    }

    public focus(args: IPageArgs) {
        this.args = args;

        this.loadData2(new Date()).then(data => {

            this.overviewIncomeAll.textContent = (toFixedValue(data.stableIncome + data.incomingPlus)).toString();
            this.overviewIncomeFixed.textContent = data.stableIncome.toString();
            this.overviewIncomeVariable.textContent = data.incomingPlus.toString();

            this.overviewExpensesAll.textContent = (toFixedValue(data.stableWaste + data.incomingWaste)).toString();
            this.overviewExpensesFixed.textContent = data.stableWaste.toString();
            this.overviewExpensesVariable.textContent = data.incomingWaste.toString();

            this.overviewSavings.textContent = data.savings.toString();
            this.overviewLeftBunget.textContent = data.left.toString();
        }).catch(e => {
            let message = e.toString();
            if (e instanceof Error) {
                message = e.message;
            }
            alert(message);
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