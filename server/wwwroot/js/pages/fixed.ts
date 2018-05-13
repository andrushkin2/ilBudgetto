import FixedContainer from "./fixed_html";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import { IPageArgs, IPage } from "../pageLoader";
import { getMonthPeriod, toServerDate, parseServerDate } from "../dateParser";
import charts, { CHART_COLORS } from "../chart";

interface IPageState {
    date?: number;
}

export default class FixedPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private fixedPieChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = FixedContainer();

        this.pageElements = getPageElements(div);

        this.fixedPieChart = this.pageElements.fixedPieChart as HTMLCanvasElement;

        let chartContext = this.fixedPieChart.getContext("2d");
        if (chartContext === null) {
            throw new Error("Cannot find context for the chart");
        }
        this.context = chartContext;

        this.content = div;

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

        this.loadData(state.date ? parseServerDate(state.date) : new Date()).then(data => {
            let colors = CHART_COLORS.slice(0, data.length);
            let labels: string[] = [];
            let dataArr: number[] = [];
            for (let i = 0, len = data.length; i < len; i++) {
                let item = data[i];
                labels.push(item.name);
                dataArr.push(item.value);
            }

            new charts(this.context, {
                type: "pie",
                data: {
                    datasets: [{
                        data: dataArr,
                        backgroundColor: colors
                    }],
                    labels: labels
                },
                options: {
                    title: {
                        display: true,
                        text: "Fixed costs"
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