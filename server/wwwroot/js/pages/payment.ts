import { IPage, IPageArgs } from "../pageLoader";
import { getPageElement, getPageElements, IPageElements } from "./pages";
import PaymentContainer from "./payment_html";
import IsSupport from "../supported";
import { IIncoming } from "../../../server/apiInstances/incomingApi";
import { ITag } from "../../../server/apiInstances/tagsApi";
import { parseServerDate, toServerDate } from "../dateParser";

let isSupport = new IsSupport();

interface IPageState {
    event?: "plus" | "minus";
    id?: string;
    typeId?: number;
}

interface IFormData {
    value: number;
    comment: string;
    tags: string[];
    date: Date | null | undefined;
    currencyId: number;
}

export default class Payment implements IPage {
    private content: HTMLDivElement;
    private args: IPageArgs;
    private paymentValue: HTMLInputElement;
    private paymentComment: HTMLInputElement;
    private paymentTag: HTMLInputElement;
    private paymentDate: HTMLInputElement;
    private paymentCurrency: HTMLSelectElement;
    private pageElements: IPageElements;
    private tags: ITag[] = [];
    private allTags: ITag[] = [];
    constructor() {
        let div = getPageElement();
        div.innerHTML = PaymentContainer();

        this.pageElements = getPageElements(div);
        this.paymentValue = this.pageElements.paymentValue as HTMLInputElement;
        this.paymentComment = this.pageElements.paymentComment as HTMLInputElement;
        this.paymentCurrency = this.pageElements.paymentCurrency as HTMLSelectElement;
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
        this.switchButtonsState(true);

        if (this.isValid(values)) {
            alert("Form is valid");
            let state = this.args.getUrlState() as IPageState;

            // add a new record
            let task: Promise<IIncoming[]>;
            if (!state.id) {
                task = this.args.store.incoming.add({
                    comment: values.comment,
                    date: toServerDate(new Date),
                    isActive: 1,
                    tags: "",
                    value: values.value,
                    currencyId: values.currencyId,
                    typeId: state.typeId || 1
                });
            } else {
                task = this.args.store.incoming.get({ id: state.id }).then(incoming => {
                    let data = incoming[0];

                    return this.args.store.incoming.set({ ...data, ...{
                        comment: values.comment,
                        date: toServerDate(new Date),
                        tags: "",
                        value: values.value,
                        currencyId: values.currencyId
                    }});
                });
            }

            task.then(() => {
                this.switchButtonsState(false);
                if (this.args.isCanGoBack()) {
                    this.args.goBack();
                } else {
                    this.args.setUrlState("main");
                }
            }).catch(err => {
                let mess = err.toString();
                if (err instanceof Error) {
                    mess = err.message;
                }
                alert(mess);
                this.switchButtonsState(false);
            });
        } else {
            this.switchButtonsState(false);
        }
    }

    private switchButtonsState(isBlock: boolean) {
        let disabled = isBlock === true ? true : false;
        (this.pageElements.paymentApply as HTMLButtonElement).disabled = disabled;
        (this.pageElements.paymentCancel as HTMLButtonElement).disabled = disabled;
    }

    private onCancel(e: Event) {
        e.preventDefault();

        if (this.args.isCanGoBack()) {
            this.args.goBack();
        } else {
            this.args.setUrlState("main", {let: undefined});
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

        let currency = values.currencyId;
        if (typeof currency !== "number" || currency === undefined || currency === null || isNaN(currency)) {
            alert("Value should be a number");
            this.paymentCurrency.focus();
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
            date: this.paymentDate.valueAsDate as Date | null | undefined,
            currencyId: parseInt(this.paymentCurrency.value) || 1
        };
    }

    private getTags(tag: string) {
        return tag.split("#").map(value => value.trim());
    }

    private fillForm(record: IIncoming) {
        this.paymentValue.value = record.value.toString();
        this.paymentComment.value = record.comment;
        this.paymentTag.value = this.tags
            .map(value => `#${ value }`)
            .join(" ");
        this.paymentDate.valueAsDate = parseServerDate(record.date);
    }

    private clearForm() {
        this.paymentValue.value = "";
        this.paymentComment.value = "";
        this.paymentTag.value = "";
        this.paymentDate.value = "";
        this.tags = [];
    }

    private loadData(args: IPageState) {
        if (args.id === undefined) {
            return this.getTagsArray().then(() => Promise.resolve<IIncoming | undefined>(undefined));
        }

        return this.args.store.incoming.get({ id: args.id }).then(record => {
            if (record && record.length === 1) {
                let data = record[0];

                return this.getTagsArray(data.tags).then(tags => {
                    this.tags = tags;

                    return data;
                });
            }

            throw new Error("Cannot find incoming with given ID");
        });
    }

    private getTagsArray(tags?: string) {

        return this.args.store.tags.get().then(tagsArray => {
            this.allTags = tagsArray.map(arr => arr[0]);

            if (!!tags && !!tags.trim()) {
                let splitted = tags.trim().split(",");
                let filterFunc = (tag: ITag) => splitted.indexOf(tag.id) !== -1;

                return this.allTags.filter(filterFunc);
            }

            return [] as ITag[];
        });
    }

    private checkState(state: IPageState) {
        return state && (state.event && (state.event === "minus" || state.event === "plus") && !state.id);
    }

    public focus(args: IPageArgs) {
        let state = args.getUrlState() as IPageState;

        this.args = args;

        if (!this.checkState(state)) {
            args.isCanGoBack() ? args.goBack() : args.setUrlState("main");
        }

        this.clearForm();

        this.loadData(state).then((value) => {
                if (value !== undefined) {
                    this.fillForm(value);
                } else {
                    this.clearForm();
                    this.paymentValue.value = `${ state.event === "plus" ? "" : "-" }0`;
                }
            }).catch(e => {
                let message = e.toString();
                if (e instanceof Error) {
                    message = e.message;
                }

                alert(message);

                args.goBack();
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
        this.switchButtonsState(false);
    }

    get node() {
        return this.content;
    }
}