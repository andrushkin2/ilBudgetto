
import IsSupport from "./js/supported";
import Header, { speachIconId } from "./js/header";
import Menu from "./js/menu";
import UrlState from "./js/urlState";
import PageLoader, { IPageArgs } from "./js/pageLoader";
import ClientApi from "./js/clientApi";
import EntityLoader from "./js/entityLoader";
import SpeachParser from "./js/speachParser";
import { IUser } from "../server/apiInstances/usersApi";
import { ICurrency } from "../server/apiInstances/currencyApi";
import { cogIcon, insertCoinIcon, pieChartColorfullIcon, moneyBag2Icon, priceTagIcon } from "./js/icons";

export interface IIdEntity {
    id: string;
}

class Budgetto {
    private productVersion = "0.5.1";
    public support = new IsSupport();
    public urlState: UrlState;
    public api: ClientApi;
    public store: EntityLoader;
    private user: IUser;
    public speachParser: SpeachParser;
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

            menu.classList.remove("shown");
        });

        this.api = new ClientApi(location.origin);
        this.store = new EntityLoader(this.api);
        this.speachParser = new SpeachParser();

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
            { name: "Main page", link: "#main", icon: priceTagIcon() },
            { name: "Daily budget", link: "#stable", icon: moneyBag2Icon() },
            { name: "Analisys", link: "#analisys", icon: pieChartColorfullIcon() },
            { name: "Transactions", link: "#list", icon: insertCoinIcon() },
            { name: "Settings", link: "#settings", icon: cogIcon("#238585", "#43c3c9") }
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
            api: this.api,
            store: this.store,
            getCurrency: () => currency,
            getUser: () => this.user,
            reloadUser: () => this.loadUser()
        };

        let page = this.urlState.getUrlState();
        let pageName = page && page.page || undefined;

        let currency: ICurrency[];

        Promise.all([
            this.loadUser(),
            this.store.currency.get()]).then(data => {
                let userData = data[0];
                let currencyData = data[1];

                if (!userData) {
                    throw new Error("Cannot get user info");
                }

                currency = currencyData;

                pageLoader.loadPage(pageName, pageArgs);
            });
    }

    private loadUser() {
        return this.store.user.get({ id: "1" }).then(data => {
            let userData = data[0];

            if (!userData) {
                throw new Error("Cannot get user info");
            }

            this.user = userData;

            return userData;
        });
    }
}


let budgetto = new Budgetto();

declare var ya: any;

window["budgetto"] = budgetto;

window["createSpeachElement"] = function () {
    window["textlineElement"] = new ya.speechkit.Textline("headerSpeachId", {
        apikey: "5ad6ae51-9cc2-4301-85bb-ade0d8a077f1",
        onInputFinished: function (text) {
            let recognize = budgetto.speachParser.recognize(text || "");
            let alertText = "";
            if (recognize instanceof Error) {
               alertText =  `${recognize.message}: ${text}`;
            } else {
                alertText = `Value: ${recognize.value} ${recognize.currency.name}\nType: General\nComment: ${recognize.comment}`;
            }
            alert(alertText);
        }
    });
    let input: HTMLInputElement | null = document.querySelector(`#${speachIconId} input`);

    if (input !== null) {
        input.readOnly = true;
        input.addEventListener("click", (e) => {
            e.preventDefault();
            return false;
        });
    }
};

export default budgetto;