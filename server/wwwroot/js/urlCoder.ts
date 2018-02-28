import { extend } from "./helpers";
import "./external/rison";

export function clearUndefined<T extends {}>(obj: T) {
    if (Array.isArray(obj)) {
        for (let len = obj.length - 1, i = len; i > -1; --i) {
            if (obj[i] === undefined) {
                obj.splice(i, 1);
            } else if (typeof obj[i] === "object") {
                clearUndefined(obj[i]);
            }
        }
    } else {
        for (let keys = Object.keys(obj || {}), len = keys.length - 1, i = len; i > -1; --i) {
            let key = keys[i];

            if (obj[key] === undefined) {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                clearUndefined(obj[key]);
            }
        }
    }

    return obj;
};

export interface IUrlStateObj {
    page?: string;
    state?: any;
}

export function encode<T extends IUrlStateObj>(state: T) {
    let resultString = "",
        perfectState = clearUndefined(extend(true, {}, state) || {});

    if (perfectState.page) {
        resultString = perfectState.page;
    }

    let stateObj = state.state;
    if (stateObj && Object.keys(stateObj).length > 0) {
        let part = rison.encode(stateObj);
        resultString += (resultString !== "" ? "," : "") + part.substr(1, part.length - 2);
    }

    return resultString;
}

export function decode<T extends IUrlStateObj>(url: string) {
    let newState: T = {} as T,
        parser = function (stateString: string) {
            let parts = stateString.split(","),
                parameters = "";

            // if first part doesn't have ':' - it's a page name
            if (parts[0].indexOf(":") === -1) {
                newState.page = parts[0];
                parameters = stateString.substring(parts[0].length + 1, stateString.length);
            } else {
                parameters = stateString;
            }

            if (parameters[parameters.length - 1] === ",") {
                parameters = parameters.substring(0, parameters.length - 1);
            }

            let paramObj = rison.decode("(" + parameters + ")");
            newState.state = paramObj.groups !== undefined ? paramObj.groups : paramObj;

            return newState;
        };

    try {
        return parser(decodeURIComponent(url));
    } catch (e) {
        throw new Error("Invalid URL");
    }
}