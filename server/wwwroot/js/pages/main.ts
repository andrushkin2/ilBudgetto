import { IPage, IPageArgs } from "../pageLoader";
import MainContainer from "./main_html";
import { getPageElement, IPageElements, getPageElements } from "./pages";
import { ServerError } from "../errors";

export default class MainPage implements IPage {
    private content: HTMLDivElement;
    private pageElements: IPageElements;
    constructor() {
        let div = getPageElement();
        div.innerHTML = MainContainer();

        this.pageElements = getPageElements(div);

        this.content = div;

    }

    public focus(args: IPageArgs) {
        let date = new Date();

        this.pageElements.mainDateSpan.textContent = `${ date.getDate() }/${date.getMonth() + 1 }/${ date.getFullYear() }`;

        args.store.user.get().then(value => {
            console.log(value);
        }).catch(e => {
            if (e instanceof ServerError) {
                console.error(e);
                return;
            }
            console.warn(e);
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