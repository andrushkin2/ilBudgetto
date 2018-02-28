import { decode, encode, clearUndefined, IUrlStateObj } from "./urlCoder";
import * as address from "./addresses";
import { extend } from "./helpers";

export default class UrlState {
    private currentState: IUrlStateObj | null = null;
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