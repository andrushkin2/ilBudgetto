import { decode, encode, clearUndefined, IUrlStateObj } from "./urlCoder";
import * as address from "./addresses";
import { extend } from "./helpers";

export default class UrlState {
    private currentState: IUrlStateObj | null = null;
    private previousStableState = "";
    constructor(urlChange: () => void) {
        this.currentState = this.readCurrentState();

        address.change(() => {
            this.currentState = this.readCurrentState();
            urlChange();
        });
    }
    private readCurrentState() {
        let newState: IUrlStateObj = {};

        try {
            newState = this.validateState(this.getStateObject());
            this.previousStableState = window.location.hash.slice(1);
        } catch (e) {
            console.log("Invalid url '" + window.location.hash + "'. Stepping back to '#" + this.previousStableState + "'");

            this.rollbackToPreviousStableState();

            if (!newState) {
                newState = this.readCurrentState();
            }
        }

        return newState;
    }
    private rollbackToPreviousStableState() {
        window.location.hash = this.previousStableState;
    }
    private getStateObject() {
        return (decode(address.get()) || {}) as IUrlStateObj;
    }
    private validateState(curState) {
        if (!this.isValid(curState)) {
            curState = this.getDefaultState();
            this.setHash(curState, false);
        }

        return curState;
    }
    private isValid(stateCandidate?: IUrlStateObj) {
        let etalon = this.getDefaultState();

        if (!stateCandidate) {
            return false;
        }

        for (let name in etalon) {
            if (!(name in stateCandidate)) {
                return false;
            }
        }

        return true;
    }
    private getDefaultState() {
        let result: IUrlStateObj = {},
            localState = this.currentState || {};

        for (let name in localState) {
            result[name] = {};
        }

        return result;
    }
    public getHash(obj: IUrlStateObj) {
        let stateString = encode(obj);

        return stateString ? `#${stateString}` : "";
    }
    public canGoBack() {
        return history.length > 1;
    }
    public goBack() {
        history.back();
    }
    public setHash(child: IUrlStateObj | string, addToHistory = false) {
        let encodedState = typeof child === "string" ? child : this.getHash(child);

        address.set(encodedState, addToHistory);
    }
    public encodeUrl(state: IUrlStateObj) {
        return encode(state);
    }
    public decodeUrl(state: string) {
        return decode(state);
    }
    public getUrlState() {
        return this.currentState;
    }
    public setUrlState(url: IUrlStateObj, addToHistory = false) {
        this.setHash(url, addToHistory);
    }
}

class UrlStateController {
    private stateName: string;

    constructor(stateName: string) {
        this.stateName = stateName;
    }

    private extendState(child: IUrlStateObj, currentState: IUrlStateObj) {
        let childState = {};
        childState[this.stateName] = child || {};
        return extend({}, currentState, child);
    }

    public getHash(child: IUrlStateObj, currentState: IUrlStateObj) {
        let state = this.extendState(child, currentState),
            stateString = encode(state);

        return stateString ? `#${stateString}` : "";
    }

    public updateCurrentState(child: IUrlStateObj, currentState: IUrlStateObj) {
        return this.extendState(child, currentState);
    }

    public setHash(child: IUrlStateObj | string, addToHistory = false) {
        let encodedState = typeof child === "string" ? child : this.getHash(child, {});

        address.set(encodedState, addToHistory);
    }
}