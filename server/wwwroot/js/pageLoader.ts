import UrlState from "./urlState";
import Header from "./header";

export interface IPage {
    focus: (args: IPageArgs) => void;
    initialize: () => void;
    blur: () => void;
}

export interface IPageArgs {
    urlState: UrlState;
    getUrlState: () => {};
    setUrlState: (pagename: string, {}) => void;
    header: Header
}

interface IPages {
    [key: string]: IPage;
}

export default class PageLoader {
    private defPageName = "main";
    private currentPage = "main";
    private activePage: IPage;
    private pages: IPages = {};
    constructor(defaultPage?: string) {
        if (defaultPage) {
            this.defPageName = defaultPage;
        }

        this.currentPage = this.defPageName;
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

            this.activePage = pageInstance;
            this.activePage.focus(args);
        }
    }
    public getPageInstance(pageName: string) {
        let page = this.pages[pageName];

        if (page) {
            return page;
        }

        return undefined;
    }
}