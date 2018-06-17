import { getPageElement, IPageElements, getPageElements } from "./pages";
import RecognizerPopupContainer from "./recognizePopup_html";
import { hide, show } from "../helpers";


export default class RecognizePopup {
    private element: HTMLDivElement;
    private elements: IPageElements;
    private formElement: HTMLDivElement;

    constructor() {
        let div = getPageElement();
        div.innerHTML = RecognizerPopupContainer();

        this.elements = getPageElements(div);
        this.element = this.elements.recognizePopup as HTMLDivElement;
        this.formElement = this.elements.recognizePaymentForm as HTMLDivElement;
    }

    public reset() {
        hide(this.formElement);
    }

    public hide() {
        hide(this.element);
    }

    public show() {
        show(this.element);
    }

    get container() {
        return this.element;
    }
}