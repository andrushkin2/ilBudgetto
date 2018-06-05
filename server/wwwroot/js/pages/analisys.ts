import { IPage } from "../pageLoader";
import { getPageElement } from "./pages";
import AnalisysContainer from "./analisys_html";

export default class AnalisysPage implements IPage {
    private content: HTMLDivElement;

    constructor() {
        let div = getPageElement();
        div.innerHTML = AnalisysContainer();

        // this.pageElements = getPageElements(div);
        this.content = div;

    }

    public focus() {}

    public initialize() {}

    public blur() {}

    get node() {
        return this.content;
    }
}