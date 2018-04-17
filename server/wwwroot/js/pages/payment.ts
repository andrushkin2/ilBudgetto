import { IPage, IPageArgs } from "../pageLoader";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import PaymentContainer from "./payment_html";
import IsSupport from "../supported";

let isSupport = new IsSupport();

interface IPageState {
    event?: "plus" | "minus",
    id?: string;
}

export default class Payment implements IPage {
    private content: HTMLDivElement;
    private pageElements: IPageElements;
    constructor() {
        let div = getPageElement();
        div.innerHTML = PaymentContainer();

        this.pageElements = getPageElements(div);

        this.content = div;

    }

    public focus(args: IPageArgs) {
        let state = args.getUrlState() as IPageState;

        if (!this.checkState(state)) {
            args.isCanGoBack() ? args.goBack() : args.setUrlState("main");
        }
    }

    public checkState(state: IPageState) {
        return state && state.event && (state.event === "minus" || state.event === "plus");
    }

    public initialize() {
        if (isSupport.dateInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "date";
        } else if (isSupport.dateTimeInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "datetime";
        } else if (isSupport.localDateTimeInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "datetime-local";
        }
    }

    public blur() {

    }

    get node() {
        return this.content;
    }
}