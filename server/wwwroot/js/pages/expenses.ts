import { IPageArgs, IPage, IKeyValue, IKeyTypedValue } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import IncomeGraphContainer from "./incomeGraph_html";
import { getMonthPeriod, toServerDate, months, parseServerDate } from "../dateParser";
import charts, { CHART_COLORS } from "../chart";
import { arrayToObject } from "./stablePage";
import { IIncoming } from "../../../server/apiInstances/incomingApi";
import { IType } from "../../../server/apiInstances/typesApi";

interface IPageState {
    date?: number;
}

export default class ExpensesGraphPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private expensesGraphBarChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = IncomeGraphContainer();

        this.pageElements = getPageElements(div);

        this.expensesGraphBarChart = this.pageElements.incomeGraphBarChart as HTMLCanvasElement;

        let chartContext = this.expensesGraphBarChart.getContext("2d");
        if (chartContext === null) {
            throw new Error("Cannot find context for the chart");
        }
        this.context = chartContext;

        this.content = div;

    }

    private loadData(date: Date, types: IType[]) {
        let period = getMonthPeriod(date);
        let search = {
            fromDate: toServerDate(period.fromDate),
            toDate: toServerDate(period.toDate)
        };

        return this.args.store.incoming.get(search).then(data => {
            let income = data.filter(value => value.value < 0);
            let typed: IKeyTypedValue<IIncoming[]> = {};

            for (let i = 0, len = income.length; i < len; i++) {
                let item = income[i];
                if (!typed[item.typeId]) {
                    typed[item.typeId] = [item];
                } else {
                    typed[item.typeId].push(item);
                }
            }

            let res: IKeyValue = {};
            let reduceFunc = (prev: number, curr: { value: number }) => prev + Math.abs(curr.value);
            let typesObj = arrayToObject(types);

            for (let i = 0, keys = Object.keys(typed), len = keys.length; i < len; i++) {
                let key = keys[i];
                let newKey = typesObj[key] ? typesObj[key].name : typesObj[1].name;
                res[newKey] = typed[key].reduce(reduceFunc, 0);
            }

            return res;
        });
    }

    public focus(args: IPageArgs) {
        this.args = args;

        let state = args.getUrlState() as IPageState;

        this.loadData(state.date ? parseServerDate(state.date) : new Date(), this.args.getTypes()).then(data => {
            let keys = Object.keys(data);
            let colors = CHART_COLORS.slice(0, keys.length);
            let labels: string[] = [];
            let sticks: any[] = [];

            let dataSets: Chart.ChartDataSets[] = [];
            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                labels.push(key);
                sticks.push({
                    ticks: {
                        beginAtZero: true
                    }
                });
                dataSets.push({
                    data: [data[key]],
                    backgroundColor: [colors[i]],
                    label: key
                });
            }

            new charts(this.context, {
                type: "bar",
                data: {
                    datasets: dataSets
                },
                options: {
                    title: {
                        display: true,
                        text: "Expenses"
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true
                    },
                    scales: {
                        yAxes: sticks
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