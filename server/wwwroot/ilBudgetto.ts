
import IsSupport from "./js/supported";
import Header from "./js/header";
import Menu from "./js/menu";
import UrlState from "./js/urlState";

class Budgetto {
    private productVersion = "0.0.1";
    public support = new IsSupport();
    public urlState: UrlState;
    get vesrion() {
        return this.productVersion;
    }
    constructor() {
        let headerElement: HTMLDivElement | null = document.querySelector("#headerId");
        let menuElement: HTMLDivElement | null = document.querySelector("#menuId");
        let menuBlock: HTMLDivElement | null = document.querySelector("#menuBlockId");

        if (headerElement === null || menuElement === null || menuBlock === null) {
            throw new Error(`Cannot find header element`);
        }

        this.urlState = new UrlState();

        let menu = menuElement;
        let onClickMenu = (e: Event) => {
            if (menu.classList.contains("shown")) {
                menu.classList.remove("shown");
            } else {
                menu.classList.add("shown");
            }
        };

        // create a header
        new Header(headerElement, onClickMenu);

        // create a main menu
        new Menu(menuBlock, [
            { name: "Main", link: "#main" },
            { name: "Analisys", link: "#analisys" },
            { name: "Settings", link: "#settings" }
        ]);
    }
}


let budgetto = new Budgetto();

window["budgetto"] = budgetto;

export default budgetto;