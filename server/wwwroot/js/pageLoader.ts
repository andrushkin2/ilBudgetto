
export interface IPage {
    focus: () => void;
    initialize: () => void;
    blur: () => void;
}

interface IPages {
    [key: string]: IPage;
}

export default class PageLoader {
    private currentPage = "main";
    private pages: IPages = {};
    constructor(defaultPage?: string) {
        if (defaultPage) {
            this.currentPage = defaultPage;
        }
    }
    public loadPage() {
        
    }
}