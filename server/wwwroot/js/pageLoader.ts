import UrlState from "./urlState";
import Header from "./header";
import { Pages } from "./pages/pages";
import ClientApi from "./clientApi";
import EntityLoader from "./entityLoader";
import { IUser } from "../../server/apiInstances/usersApi";
import { ICurrency } from "../../server/apiInstances/currencyApi";
import { IType } from "../../server/apiInstances/typesApi";

export interface IPage {
    focus: (args: IPageArgs) => void;
    initialize: () => void;
    blur: () => void;
    node: HTMLDivElement;
}

export interface IKeyTypedValue<T> {
    [key: string]: T;
}

export interface IKeyValue {
    [key: string]: any;
}

export interface IPageArgs {
    urlState: UrlState;
    setTitle: (text: string) => void;
    goBack: () => void;
    isCanGoBack: () => void;
    getUrlState: () => IKeyValue;
    setUrlState: (pagename: string, state?: IKeyValue) => void;
    api: ClientApi;
    store: EntityLoader;
    header: Header;
    getUser: () => IUser;
    reloadUser: () => Promise<IUser>;
    getCurrency: () => ICurrency[];
    getTypes: () => IType[];
}

interface IPages {
    [key: string]: IPage;
}

export default class PageLoader {
    private defPageName = "main";
    private currentPage: string;
    private activePage: IPage;
    private mainBlock: HTMLDivElement;
    private pages: IPages = {};
    constructor(mainConatiner: HTMLDivElement, defaultPage?: string) {
        this.mainBlock = mainConatiner;
        if (defaultPage) {
            this.defPageName = defaultPage;
        }

        this.currentPage = this.defPageName;

        if (Pages[this.currentPage]) {
            let instance = new Pages[this.currentPage]();

            this.mainBlock.appendChild(instance.node);

            instance.initialize();
            this.activePage = instance;
            this.pages[this.currentPage] = instance;
        } else {
            throw new Error("There is not main page");
        }
    }
    public loadPage(pageName: string | undefined, args: IPageArgs) {
        let page = pageName ? pageName : this.defPageName;

        if (this.currentPage === page) {
            this.activePage.focus(args);

            return;
        }

        let pageInstance = this.getPageInstance(page);

        if (pageInstance) {
            this.activePage.blur();

            let child = this.mainBlock.firstChild;
            if (child) {
                this.mainBlock.removeChild(child);
            }

            this.currentPage = page;
            args.setTitle(page);

            this.activePage = pageInstance;

            // append new page node and focus page
            this.mainBlock.appendChild(this.activePage.node);
            this.activePage.focus(args);
        }
    }
    public getPageInstance(pageName: string) {
        let page = this.pages[pageName];

        if (page) {
            return page;
        }

        if (Pages[pageName]) {
            let instance = new Pages[pageName]();

            this.mainBlock.appendChild(instance.node);

            instance.initialize();
            this.pages[pageName] = instance;

            return instance;
        }

        return undefined;
    }
}