import { IPage, IPageArgs } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import TrendsContainer from "./trends_html";
import { getMonthPeriod, toServerDate, parseServerDate } from "../dateParser";
import charts, { CHART_COLORS } from "../chart";


interface IPageState {
    date?: number;
}

export default class TrendsPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private trendsPieChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = TrendsContainer();

        this.pageElements = getPageElements(div);

        this.trendsPieChart = this.pageElements.trendsPieChart as HTMLCanvasElement;

        let chartContext = this.trendsPieChart.getContext("2d");
        if (chartContext === null) {
            throw new Error("Cannot find context for the chart");
        }
        this.context = chartContext;

        this.content = div;

    }

    private loadData2(date: Date) {
        let period = getMonthPeriod(date);
        let search = {
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        };

        return Promise.all([
            this.args.store.stableIncome.get(search),
            this.args.store.incoming.get(search),
            this.args.store.stableWaste.get(search)
        ]).then(data => {
            let reduceFunc = (prev: number, value: { value: number }) => prev + Math.abs(value.value);

            let stableIncome = data[0].reduce(reduceFunc, 0);
            let income = data[1].filter(value => value.value >= 0).reduce(reduceFunc, 0);
            let expenses = data[1].filter(value => value.value < 0).reduce(reduceFunc, 0);
            let stableWaste = data[2].reduce(reduceFunc, 0);

            let savings = stableIncome + income - expenses - stableWaste;

            return { savings, expenses, stableWaste };
        });
    }

    private loadData(date: Date) {
        let period = getMonthPeriod(date);

        return this.args.store.stableWaste.get({
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        });
    }

    public focus(args: IPageArgs) {
        this.args = args;

        let state = args.getUrlState() as IPageState;

        this.loadData2(state.date ? parseServerDate(state.date) : new Date()).then(data => {
            let colors = ["rgb(54, 162, 235)", "rgb(255, 99, 132)", "rgb(75, 192, 192)"];

            new charts(this.context, {
                type: "bar",
                data: {
                    datasets: [
                        {
                            data: [data.savings],
                            backgroundColor: [colors[0]],
                            label: "Savings"
                        },
                        {
                            data: [data.expenses],
                            backgroundColor: [colors[1]],
                            label: "Expenses"
                        },
                        {
                            data: [data.stableWaste],
                            backgroundColor: [colors[2]],
                            label: "Fixed costs"
                        }
                    ],
                    labels: ["Current month"]
                },
                options: {
                    title: {
                        display: true,
                        text: "Trends"
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true
                    },
                    scales: {
                        xAxes: [{
                            stacked: true
                        }],
                        yAxes: [{
                            stacked: true
                        }]
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