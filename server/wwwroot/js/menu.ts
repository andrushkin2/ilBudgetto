
export interface IMenuItem {
    name: string;
    link: string;
}

export default class Menu {
    constructor(menuElement: HTMLDivElement, items: IMenuItem[] = []) {
        let html = `<ul class=\"list list_def_color menuList menuList_dark\">
                ${ items.reduce((res, item) => res + `<li class=\"listItem menuListItem menuListItem_dark\">${ item.name }</li>`, "") }
            </ul>`;

        menuElement.innerHTML = html;
    }
}