
import IsSupport from "./js/supported";
import Header from "./js/header";
import Menu from "./js/menu";
import UrlState from "./js/urlState";
import PageLoader, { IPageArgs } from "./js/pageLoader";
import ClientApi from "./js/clientApi";

export interface IIdEntity {
    id: string;
}

class Budgetto {
    private productVersion = "0.0.1";
    public support = new IsSupport();
    public urlState: UrlState;
    public api: ClientApi;
    get vesrion() {
        return this.productVersion;
    }
    constructor() {
        let headerElement: HTMLDivElement | null = document.querySelector("#headerId");
        let menuElement: HTMLDivElement | null = document.querySelector("#menuId");
        let menuBlock: HTMLDivElement | null = document.querySelector("#menuBlockId");
        let titleElement: HTMLTitleElement | null = document.querySelector("#titleId");
        let mainBlock: HTMLDivElement | null = document.querySelector("#data_block");

        if (titleElement === null || headerElement === null || menuElement === null || menuBlock === null || mainBlock === null) {
            throw new Error(`Cannot find header element`);
        }

        let pageLoader = new PageLoader(mainBlock, "main");

        this.urlState = new UrlState(() => {
            let state = this.urlState.getUrlState();
            let pageNameString = state ? state.page : undefined;

            pageLoader.loadPage(pageNameString, pageArgs);
        });

        this.api = new ClientApi(location.origin);

        let menu = menuElement;
        let onClickMenu = (e: Event) => {
            e.preventDefault();

            if (menu.classList.contains("shown")) {
                menu.classList.remove("shown");
            } else {
                menu.classList.add("shown");
            }
        };

        // create a header
        let header = new Header(headerElement, onClickMenu);

        // create a main menu
        new Menu(menuBlock, [
            { name: "Main", link: "#main" },
            { name: "Analisys", link: "#analisys" },
            { name: "Settings", link: "#settings" }
        ]);

        let title = titleElement;
        let pageArgs: IPageArgs = {
            urlState: this.urlState,
            header,
            goBack: () => this.urlState.goBack(),
            isCanGoBack: () => this.urlState.canGoBack(),
            setTitle: (text: string) => {
                title.textContent = `il budgetto | ${ text }`;
            },
            getUrlState: () => {
                let state = this.urlState.getUrlState();

                if (state && state.state) {
                    return state.state;
                }

                return {};
            },
            setUrlState: (pageNameStr: string, args: any) => {
                this.urlState.setUrlState({
                    page: pageNameStr,
                    state: args
                });
            },
            api: this.api
        };

        let page = this.urlState.getUrlState();
        let pageName = page && page.page || undefined;

        pageLoader.loadPage(pageName, pageArgs);
    }
}


let budgetto = new Budgetto();

window["budgetto"] = budgetto;

export default budgetto;