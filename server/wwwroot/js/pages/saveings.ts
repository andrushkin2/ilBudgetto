import SavingsContainer from "./saveings_html";
import { IPageArgs, IPage, IKeyValue } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import { getMonthPeriod, toServerDate, IDatePeriod, addDays, parseServerDate, addMonths } from "../dateParser";
import { getDaylyBudget, toFixedValue, IData } from "./list";
import { IIncoming } from "../../../server/apiInstances/incomingApi";
import charts from "../chart";
import { IStableWaste } from "../../../server/apiInstances/stableWaste";

interface IPageState {
    date?: number;
}

export default class SavingsGraphPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private savingsGraphBarChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = SavingsContainer();

        this.pageElements = getPageElements(div);

        this.savingsGraphBarChart = this.pageElements.savingsGraphBarChart as HTMLCanvasElement;

        let chartContext = this.savingsGraphBarChart.getContext("2d");
        if (chartContext === null) {
            throw new Error("Cannot find context for the chart");
        }
        this.context = chartContext;

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

        return Promise.all([this.args.store.incoming.get(search),
        this.args.store.stableIncome.get(search),
        this.args.store.stableWaste.get(search),
        this.args.store.incoming.get(search).then(data => {
            data.sort((a, b) => a.date - b.date);

            let periodData = this.getDataForPeriod(period);

            for (let i = 0, len = data.length; i < len; i++) {
                let item = data[i];
                let dateObj = item.date.toString();

                if (periodData[dateObj]) {
                    periodData[dateObj].push(item);
                }
            }

            return periodData;
        }),
        this.getSavingForPrevPeriod(prevPeriod)
        ]).then(data => {
            let dailyBudget = getDaylyBudget(data[1], data[2]);
            let reduceFunc = (prev: number, value: IIncoming) => prev + value.value;
            let prevMonthSavings = data[4];

            let incomingData = data[3];
            let keys = Object.keys(incomingData);

            let res: IKeyValue = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];

                prevMonthSavings = toFixedValue(prevMonthSavings + dailyBudget + incomingData[key].reduce(reduceFunc, 0));

                res[key] = prevMonthSavings;
            }

            return res;
        });
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

    public focus(args: IPageArgs) {
        this.args = args;

        let state = args.getUrlState() as IPageState;

        this.loadData2(state.date ? parseServerDate(state.date) : new Date()).then(data => {
            let keys = Object.keys(data);
            let labels: string[] = [];
            let colors: string[] = [];
            let dataArr: number[] = [];

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let serverDate = parseServerDate(parseInt(key));
                let value: number = data[key];

                labels.push(`${serverDate.getDate()}/${serverDate.getMonth() + 1}`);
                colors.push("rgb(255, 159, 64)");

                dataArr.push(value);
            }

            new charts(this.context, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataArr,
                        backgroundColor: "rgba(255, 159, 64, 0.5)",
                        borderColor: "#FF5722",
                        label: "Savings"
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Savings"
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
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