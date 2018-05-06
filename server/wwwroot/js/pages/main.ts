import { IPage, IPageArgs } from "../pageLoader";
import MainContainer from "./main_html";
import { getPageElement, IPageElements, getPageElements } from "./pages";
import { ServerError } from "../errors";
import { toServerDate } from "../dateParser";

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

        args.store.incoming.get({
            // fromDate: toServerDate(new Date(new Date().setDate(14))),
            // id: "3"
           /*  comment: "Beer",
            currencyId: 1,
            isActive: 1,
            typeId: 1,
            tags: "",
            value: 34.5,
            date: toServerDate(new Date()) */
        }).then(value => {
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