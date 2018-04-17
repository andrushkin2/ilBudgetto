import MainPage from "./main";
import { IPage } from "../pageLoader";

interface IKnownPages {
    [key: string]: new () => IPage;
}

export interface IPageElements {
    [elementId: string]: HTMLElement;
}

let pages: IKnownPages = {
    main: MainPage
}

export { pages as Pages }

export function getPageElement() {
    let div = document.createElement("div");
    div.classList.add("pageClass");
    
    return div;
}

export function getPageElements(element: HTMLDivElement) {
    let elements = element.querySelectorAll('[id]');
    let result: IPageElements = {};

    for (let i = 0, len = elements.length; i < len; i++) {
        let item = elements.item(i);

        result[item.id] = item as HTMLElement;
    }

    return result;
}