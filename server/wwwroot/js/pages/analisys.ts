import { IPage, IPageArgs } from "../pageLoader";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import AnalisysContainer from "./analisys_html";

export default class AnalisysPage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;

    constructor() {
        let div = getPageElement();
        div.innerHTML = AnalisysContainer();

        this.pageElements = getPageElements(div);
        this.content = div;

    }

    public focus(args: IPageArgs) {
        this.args = args;

    }

    public initialize() {

    }

    public blur() {

    }

    get node() {
        return this.content;
    }
}