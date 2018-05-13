import { IPage, IPageArgs, IKeyTypedValue } from "../pageLoader";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import StableContainer, { GetWasteInput } from "./stablePage_html";
import { getMonthPeriod, toServerDate } from "../dateParser";
import { IStableIncome } from "../../../server/apiInstances/stableIncome";
import { IStableWaste } from "../../../server/apiInstances/stableWaste";
import { show, hide } from "../helpers";
import { IIdEntity } from "../../ilBudgetto";

const arrayToObject = <T extends IIdEntity>(arr: T[]) => {
    let res: IKeyTypedValue<T> = {};

    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        res[item.id] = item;
    }

    return res;
};

export {arrayToObject};

interface IFromData {
    id?: string;
    value: number;
    name: string;
    currencyId: number;
}

export default class StablePage implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private pageElements: IPageElements;
    private stableSeleryText: HTMLSpanElement;
    private stableWasteText: HTMLSpanElement;
    private stableWastePopup: HTMLDivElement;
    private stableWastePopupForm: HTMLDivElement;
    private stableWastePlusButton: HTMLDivElement;
    private popupHeader: HTMLDivElement;

    private stableIncomeData: IStableIncome[] = [];
    private stableWasteData: IStableWaste[] = [];
    private state: "stableIncome" | "stableWaste" = "stableWaste";

    constructor() {
        let div = getPageElement();
        div.innerHTML = StableContainer();

        this.pageElements = getPageElements(div);
        this.stableSeleryText = this.pageElements.stableSeleryText;
        this.stableWasteText = this.pageElements.stableWasteText;

        this.stableWastePopup = this.pageElements.stableWastePopup as HTMLDivElement;
        this.popupHeader = this.stableWastePopup.querySelector(".windowHeader") as HTMLDivElement;

        this.stableWastePopupForm = this.pageElements.stableWastePopupForm as HTMLDivElement;
        this.stableWastePlusButton = this.pageElements.stableWastePlusButton as HTMLDivElement;

        this.content = div;

        // income popup
        this.pageElements.stableIncome.addEventListener("click", e => {
            e.preventDefault();
            this.state = "stableIncome";
            this.updateHeaderText("Stable income");

            this.clearForm(this.stableWastePopupForm);
            this.fillForm(this.stableIncomeData, this.stableWastePopupForm);

            show(this.stableWastePopup);
        }, false);

        //add new field
        this.stableWastePlusButton.addEventListener("click", e => {
            e.preventDefault();

            let fragment = document.createElement("div");
            fragment.innerHTML = GetWasteInput(this.args.getCurrency());

            this.stableWastePopupForm.insertBefore(fragment.firstChild as HTMLElement, this.pageElements.stableWastePlusButtonNode);
        }, false);

        // waste popup
        this.pageElements.stableWaste.addEventListener("click", e => {
            e.preventDefault();

            this.state = "stableWaste";
            this.updateHeaderText("Stable waste");

            this.clearForm(this.stableWastePopupForm);
            this.fillForm(this.stableWasteData, this.stableWastePopupForm);

            show(this.stableWastePopup);
        }, false);
        // waste cancel
        this.pageElements.stableWasteCancel.addEventListener("click", e => {
            e.preventDefault();
            hide(this.stableWastePopup);
        }, false);

        //waste apply
        this.pageElements.stableWasteApply.addEventListener("click", e => {
            e.preventDefault();
            this.switchButtonsState(true);

            let formData = this.getFormData(this.stableWastePopupForm);
            if (formData instanceof Error || formData.length === 0) {
                this.switchButtonsState(false);
                return;
            }

            this.updateData(formData).then(data => {
                this.switchButtonsState(false);

                if (this.state === "stableWaste") {
                    this.stableWasteData = data as IStableWaste[];
                }
                else {
                    this.stableIncomeData = data;
                }

                // update data on page
                this.updateDataOnPage();

                hide(this.stableWastePopup);
            }).catch(err => {
                this.switchButtonsState(false);
                let mess = err instanceof Error ? err.message : err.toString();
                alert(mess);
                console.error(err);
            });

        }, false);
    }

    private updateHeaderText(text: string) {
        this.popupHeader.textContent = text;
    }

    private updateData(formData: IFromData[]): Promise<(IStableIncome | IStableWaste)[]> {
        let startMonthDate = toServerDate(getMonthPeriod(new Date()).fromDate);

        if (this.state === "stableWaste") {
            let objWaste = arrayToObject(this.stableWasteData);

            return Promise.all(formData.map(value => {
                if (value.id && objWaste[value.id]) {
                    let setObj: IStableWaste = { ...objWaste[value.id], ...{
                        value: value.value,
                        currencyId: value.currencyId,
                        name: value.name
                    }};

                    return this.args.store.stableWaste.set(setObj);
                } else {
                    return this.args.store.stableWaste.add({
                        name: value.name,
                        currencyId: value.currencyId,
                        date: startMonthDate,
                        isActive: 1,
                        value: value.value
                    });
                }
            })).then(data => data.map(value => value[0]));
        } else if (this.state === "stableIncome") {
            let objIncome = arrayToObject(this.stableIncomeData);

            return Promise.all(formData.map(value => {
                if (value.id && objIncome[value.id]) {
                    let setObj: IStableIncome = {
                        ...objIncome[value.id], ...{
                            value: value.value,
                            currencyId: value.currencyId,
                            name: value.name
                        }
                    };

                    return this.args.store.stableIncome.set(setObj);
                } else {
                    return this.args.store.stableIncome.add({
                        name: value.name,
                        currencyId: value.currencyId,
                        date: startMonthDate,
                        value: value.value
                    });
                }
            })).then(data => data.map(value => value[0]));
        }

        return Promise.resolve([]);
    }

    private switchButtonsState(isBlock: boolean) {
        let disabled = isBlock === true ? true : false;
        (this.pageElements.stableWasteApply as HTMLButtonElement).disabled = disabled;
        (this.pageElements.stableWasteCancel as HTMLButtonElement).disabled = disabled;
    }

    private fillForm(data: (IStableWaste | IStableIncome)[], form: HTMLDivElement) {
        let currency = this.args.getCurrency();

        data.forEach(value => {
            let fragment = document.createElement("div");
            fragment.innerHTML = GetWasteInput(currency, value);

            form.insertBefore(fragment.firstChild as HTMLElement, this.pageElements.stableWastePlusButtonNode);
        });
    }

    private clearForm(form: HTMLDivElement) {
        let elems = form.querySelectorAll(".formFeild");

        for (let i = 0, len = elems.length; i < len; i++) {
            let element = elems.item(i);
            if (element.parentNode && element.parentNode === form) {
                form.removeChild(element);
            }
        }
    }

    private isValueValid(value: number, element: HTMLInputElement | HTMLSelectElement) {
        if (typeof value !== "number" || value === undefined || value === null || isNaN(value)) {
            alert("Value should be a number");
            element.focus();
            return false;
        }

        return true;
    }

    private getFormData(form: HTMLDivElement) {
        let elems = form.querySelectorAll(".formFeild");
        let result: IFromData[] = [];

        for (let i = 0, len = elems.length; i < len; i++) {
            let element = elems.item(i);
            let input = element.querySelector(".stableWasteValue") as HTMLInputElement || null;
            let select = element.querySelector(".stableWasteCurrency") as HTMLSelectElement | null;
            let name = element.querySelector(".stableWasteName") as HTMLInputElement | null;

            if (!input || !select || !name) {
                continue;
            }

            let value = parseFloat(input.value.trim());
            let type = parseInt(select.value.trim());
            let comment = name.value.trim();
            let id = element.getAttribute("data-id");

            if (!this.isValueValid(value, input) || !this.isValueValid(type, select) || !comment) {
                return new Error("Wrong input value");
            }

            let res: IFromData = {
                currencyId: type,
                value: value,
                name: comment
            };

            if (!!id) {
                res.id = id;
            }

            result.push(res);
        }

        return result;
    }

    private loadData() {
        let thisMonth = getMonthPeriod(new Date());
        let search = {
                fromDate: toServerDate(thisMonth.fromDate),
                toDate: toServerDate(thisMonth.toDate)
            };

        return Promise.all([
            this.args.store.stableIncome.get(search),
            this.args.store.stableWaste.get(search)
        ]);
    }

    private getSum(data: { value: number }[]) {
        return data.reduce((res, curr) => res + curr.value, 0);
    }

    private updateDataOnPage() {
        let currency = this.args.getCurrency()[0];
        this.stableSeleryText.textContent = `${this.getSum(this.stableIncomeData)} ${currency.name}`;

        this.stableWasteText.textContent = `${this.getSum(this.stableWasteData)} ${currency.name}`;
    }

    public focus(args: IPageArgs) {
        this.args = args;

        this.loadData().then(data => {
            this.stableIncomeData = data[0];
            this.stableWasteData = data[1];

            this.updateDataOnPage();
        }).catch(e => {
            let mess = e instanceof Error ? e.message : e.toString();
            alert(mess);
            console.error(e);
        });
    }

    public initialize() {

    }

    public blur() {
        this.stableIncomeData = [];
        this.stableWasteData = [];

        this.switchButtonsState(false);
        hide(this.stableWastePopup);
    }

    get node() {
        return this.content;
    }
}