
import IsSupport from "./js/supported";
import Header from "./js/header";

class Budgetto {
    private productVersion = "0.0.1";
    public support = new IsSupport();
    get vesrion() {
        return this.productVersion;
    }
    constructor() {
        let headerElement: HTMLDivElement | null = document.querySelector("#headerId");
        let menuElement: HTMLDivElement | null = document.querySelector("#menuId");

        if (headerElement === null || menuElement === null) {
            throw new Error(`Cannot find header element`);
        }

        let menu = menuElement;
        let onClickMenu = (e: Event) => {
            if (menu.classList.contains("shown")) {
                menu.classList.remove("shown");
            } else {
                menu.classList.add("shown");
            }
        };

        new Header(headerElement, onClickMenu);
    }
}


let budgetto = new Budgetto();

window["budgetto"] = budgetto;

export default budgetto;