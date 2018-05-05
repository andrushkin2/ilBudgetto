import { IPage, IPageArgs } from "../pageLoader";
import MainContainer from "./main_html";
import { getPageElement, IPageElements, getPageElements } from "./pages";
import { IUser, IUserSearch } from "../../../server/apiInstances/usersApi";
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

        args.api.post<IUserSearch, IUser>({
            method: "Get",
            type: "User",
            entity: {}
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