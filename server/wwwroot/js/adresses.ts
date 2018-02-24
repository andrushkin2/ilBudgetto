
interface IAddressItem {
    url: string;
    timeStamp: number;
}

let oldValue = window.location.hash,
    handlers: ((isInternalChange: boolean) => void)[] = [],
    onHashChangeHandlerAdded = false,
    historyTracker = (() => {
        let items: IAddressItem[] = [];
        return {
            add: (url: string) => {
                items.push({
                    url: url,
                    timeStamp: new Date().getTime()
                });
            },
            all: items
        };
    })(),
    checkForAddressChange = function (internalChangeCheck) {
        if (oldValue !== window.location.hash) {
            oldValue = window.location.hash;

            historyTracker.add(window.location.hash);

            for (let i = 0, len = handlers.length; i < len; i++) {
                handlers[i](!internalChangeCheck);
            }
        }
    },
    notInternalChange = function () {
        checkForAddressChange(false);
    },
    cell = /#/;

export function change(handler: (isInternalChange: boolean) => void) {
    handlers.push(handler);
    if (!onHashChangeHandlerAdded) {
        onHashChangeHandlerAdded = true;
        window.addEventListener("hashchange", notInternalChange, true);
    }
}

export function destroy() {
    window.removeEventListener("hashchange", notInternalChange, true);
    onHashChangeHandlerAdded = false;
}

export function set(address: string, putIntoHistory?: boolean) {
    if (address || window.location.hash) {
        if (putIntoHistory) {
            window.location.hash = "#" + address.replace(cell, "");
        } else {
            window.location.replace("#" + address.replace(cell, ""));
        }
    }
    checkForAddressChange(true);
}

export function get() {
    return window.location.hash.replace(cell, "");
}

export var history = historyTracker.all;

historyTracker.add("#" + get());