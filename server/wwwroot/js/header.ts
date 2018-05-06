import { menuIcon } from "./icons";

const speachIconId = "headerSpeachId";

export { speachIconId };

export default class Header {
    constructor(headerElement: HTMLDivElement, onMenuClick: (e: Event) => void) {
        let menuIconId = "headerMenuId",
            getHeaderElement = (className?: string, id?: string) => `<div class=\"headerItem${className !== undefined ? ` ${className}` : ""}\" ${id !== undefined ? `id=\"${id}\"` : ""}></div>`;

        let headerHtml = [["menuIcon", menuIconId], ["speachItem", speachIconId]].map(item => getHeaderElement(item[0], item[1]));

        headerElement.innerHTML = headerHtml.join("");

        let menuIconElement = document.querySelector(`#${menuIconId}`) as HTMLDivElement;
        menuIconElement.innerHTML = menuIcon();
        menuIconElement.addEventListener("click", e => {
            onMenuClick(e);
        }, false);
    }
}