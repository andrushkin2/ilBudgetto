import { IPage, IPageArgs } from "../pageLoader";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import PaymentContainer from "./payment_html";
import IsSupport from "../supported";

let isSupport = new IsSupport();

interface IPageState {
    event?: "plus" | "minus";
    id?: string;
}

interface IRecord {
    id?: string;
    value: number;
    comment: string;
    tags: string[];
    date: string;
}

interface IFormData {
    value: number;
    comment: string;
    tags: string[];
    date: Date | null | undefined;
}

export default class Payment implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private isAdd = true;
    private paymentValue: HTMLInputElement;
    private paymentComment: HTMLInputElement;
    private paymentTag: HTMLInputElement;
    private paymentDate: HTMLInputElement;
    private pageElements: IPageElements;
    constructor() {
        let div = getPageElement();
        div.innerHTML = PaymentContainer();

        this.pageElements = getPageElements(div);
        this.paymentValue = this.pageElements.paymentValue as HTMLInputElement;
        this.paymentComment = this.pageElements.paymentComment as HTMLInputElement;
        this.paymentTag = this.pageElements.paymentTag as HTMLInputElement;
        this.paymentDate = this.pageElements.paymentDate as HTMLInputElement;

        this.content = div;

        this.pageElements.paymentApply.addEventListener("click", (e) => {
            this.onApply(e);
        }, false);

        this.pageElements.paymentCancel.addEventListener("click", (e) => {
            this.onCancel(e);
        }, false);
    }

    private onApply(e: Event) {
        e.preventDefault();

        let values = this.getFormValues();

        if (this.isValid(values)) {
            alert("Form is valid");
        }
    }

    private onCancel(e: Event) {
        e.preventDefault();

        if (this.args.isCanGoBack()) {
            this.args.goBack();
        } else {
            this.args.setUrlState("main", {});
        }
    }

    private isValid(values: IFormData) {
        let value = values.value;
        if (typeof value !== "number" || value === undefined || value === null || isNaN(value)) {
            alert("Value should be a number");
            this.paymentValue.focus();
            return false;
        }

        let comment = values.comment;
        if (typeof comment !== "string" || comment === undefined || comment === null) {
            alert("Comment should be a string");
            this.paymentComment.focus();
            return false;
        }

        let tags = values.tags;
        if (!tags || !Array.isArray(tags)) {
            alert("Tags are incorrect");
            this.paymentTag.focus();
            return false;
        }

        let date = values.date;
        if (!date || isNaN(date as any) || !(date instanceof Date)) {
            alert("Date is incorrect");
            this.paymentDate.focus();
            return false;
        }

        return true;
    }

    private getFormValues(): IFormData {
        return {
            value: parseFloat(this.paymentValue.value.trim()),
            comment: this.paymentComment.value.trim(),
            tags: this.getTags(this.paymentTag.value.trim()),
            date: this.paymentDate.valueAsDate as Date | null | undefined
        };
    }

    private getTags(tag: string) {
        return tag.split("#").map(value => value.trim());
    }

    private fillForm(record: IRecord) {
        this.paymentValue.value = record.value.toString();
        this.paymentComment.value = record.comment;
        this.paymentTag.value = record.tags
            .map(value => `#${ value }`)
            .join(" ");
        this.paymentDate.valueAsDate = new Date(record.date);
    }

    private clearForm() {
        this.paymentValue.value = "";
        this.paymentComment.value = "";
        this.paymentTag.value = "";
        this.paymentDate.value = "";
    }

    private loadData(args: IPageState) {
        if (this.isAdd) {
            return Promise.resolve<undefined | IRecord>(undefined);
        }

        let record: IRecord = {
            comment: "Shopping",
            date: new Date().toString(),
            tags: ["tea", "Ontario"],
            value: 123.32,
            id: args.id
        };
        return Promise.resolve<IRecord>(record);
    }

    private checkState(state: IPageState) {
        return state && state.event && (state.event === "minus" || state.event === "plus");
    }

    public focus(args: IPageArgs) {
        let state = args.getUrlState() as IPageState;

        this.args = args;

        if (!this.checkState(state)) {
            args.isCanGoBack() ? args.goBack() : args.setUrlState("main");
        }

        this.isAdd = state.id === undefined;

        let data = this.loadData(state);
        data.then((value) => {
            if (value !== undefined) {
                this.fillForm(value);
            }
        });
    }

    public initialize() {
        if (isSupport.dateInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "date";
        } else if (isSupport.dateTimeInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "datetime";
        } else if (isSupport.localDateTimeInput) {
            (<HTMLInputElement>this.pageElements.paymentDate).type = "datetime-local";
        }
    }

    public blur() {
        this.clearForm();
    }

    get node() {
        return this.content;
    }
}