import IncomeGraphContainer from "./incomeGraph_html";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import { IPageArgs, IPage } from "../pageLoader";
import { getMonthPeriod, toServerDate, parseServerDate, months, addMonths } from "../dateParser";
import charts from "../chart";

interface IPageState {
    date?: number;
}

export default class IncomeGraphPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private incomeGraphBarChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = IncomeGraphContainer();

        this.pageElements = getPageElements(div);

        this.incomeGraphBarChart = this.pageElements.incomeGraphBarChart as HTMLCanvasElement;

        let chartContext = this.incomeGraphBarChart.getContext("2d");
        if (chartContext === null) {
            throw new Error("Cannot find context for the chart");
        }
        this.context = chartContext;

        this.content = div;

    }

    private loadData(date: Date) {
        let period = getMonthPeriod(date);
        let search = {
                fromDate: toServerDate(period.fromDate),
                toDate: toServerDate(period.toDate)
            };

        return Promise.all([
            this.args.store.stableIncome.get(search),
            this.args.store.incoming.get(search)
        ]).then(data => {
            let reduceFunc = (prev: number, value: { value: number }) => prev + value.value;
            let stableIncome = data[0].reduce(reduceFunc, 0);
            let income = data[1].filter(value => value.value >= 0).reduce(reduceFunc, 0);

            return { stableIncome, income };
        });
    }
    private getLabelName(date: Date) {
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    public focus(args: IPageArgs) {
        this.args = args;

        let state = args.getUrlState() as IPageState;

        this.loadData(state.date ? parseServerDate(state.date) : new Date()).then(data => {
            let colors = ["#ff3d67", "#36a2eb"];

            new charts(this.context, {
                type: "bar",
                data: {
                    datasets: [
                        {
                            data: [1000, 1650, data.stableIncome],
                            backgroundColor: [colors[0], colors[0], colors[0]],
                            label: "Stable income"
                        },
                        {
                            data: [100, 50, data.income],
                            backgroundColor: [colors[1], colors[1], colors[1]],
                            label: "Extra income"
                        }
                    ],
                    labels: [this.getLabelName(addMonths(new Date(), -2)), this.getLabelName(addMonths(new Date(), -1)), this.getLabelName(new Date())]
                },
                options: {
                    title: {
                        display: true,
                        text: "Income"
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true
                    }
                }
            });
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