import { IPage, IPageArgs, IKeyValue } from "../pageLoader";
import { IPageElements, getPageElement, getPageElements } from "./pages";
import SurplusContainer from "./surplus_html";
import { getMonthPeriod, toServerDate, parseServerDate, IDatePeriod, addDays } from "../dateParser";
import charts from "../chart";
import { IIncoming } from "../../../server/apiInstances/incomingApi";
import { getDaylyBudget, IData, toFixedValue } from "./list";


interface IPageState {
    date?: number;
}

export default class SurplusGraphPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    private surplusGraphBarChart: HTMLCanvasElement;

    private context: CanvasRenderingContext2D;

    constructor() {
        let div = getPageElement();
        div.innerHTML = SurplusContainer();

        this.pageElements = getPageElements(div);

        this.surplusGraphBarChart = this.pageElements.surplusGraphBarChart as HTMLCanvasElement;

        let chartContext = this.surplusGraphBarChart.getContext("2d");
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
            })
        ]).then(data => {
            let dailyBudget = getDaylyBudget(data[1], data[2]);
            let reduceFunc = (prev: number, value: IIncoming) => prev + value.value;

            let incomingData = data[3];
            let keys = Object.keys(incomingData);

            let res: IKeyValue = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                let key = keys[i];
                let dayData = toFixedValue(dailyBudget + incomingData[key].reduce(reduceFunc, 0));

                res[key] = dayData;
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
                colors.push(value >= 0 ? "rgb(54, 162, 235)" : "rgb(255, 99, 132)");

                dataArr.push(data[key]);
            }

            new charts(this.context, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataArr,
                        backgroundColor: colors,
                        label: "Surplus"
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: "Daily surplus"
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