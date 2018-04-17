import { IPage } from "../pageLoader";
import MainContainer from "./main_html";
import { getPageElement, IPageElements, getPageElements } from "./pages";

export default class MainPage implements IPage {
    private content: HTMLDivElement;
    private pageElements: IPageElements;
    constructor() {
        let div = getPageElement();
        div.innerHTML = MainContainer();

        this.pageElements = getPageElements(div);

        this.content = div;

    }

    public focus() {
        let date = new Date();

        this.pageElements.mainDateSpan.textContent = `${ date.getDate() }/${date.getMonth() + 1 }/${ date.getFullYear() }`;
    }

    public initialize() {

    }

    public blur() {

    }

    get node() {
        return this.content;
    }
}