
let isBrowserSupportTouchEvents = (() => {
        let result = true;
        try {
            document.createEvent("TouchEvent");
        } catch (e) {
            result = false;
        }
        return result;
    })(),
    typeOfInputSupport = (() => {
        let testEl = document.createElement("input");
        return (type, testValue) => {
            testEl.setAttribute("type", type);
            testEl.setAttribute("value", testValue);
            return testEl.type === type && testEl.value !== testValue;
        };
    })(),
    inputDateTypeSupport = function (type) {
        return typeOfInputSupport(type, "2018-1-1");
    },
    isBrowserSupportDateTimeInput = typeOfInputSupport("datetime", "2018-1-1"),
    isBrowserSupportLocalDateTimeInput = typeOfInputSupport("datetime-local", "2018-1-1"),
    isBrowserSupportDateInput = inputDateTypeSupport("date"),
    isBrowserSupportTimeInput = inputDateTypeSupport("time"),
    isBrowserSupportSlider = typeOfInputSupport("range", "a"),
    isOldBrowser = (function () {
        var featuresThatHaveToBeInBrowser = [function () {
            return typeof Object.keys === "function";
        }, function () {
            return typeof Array.prototype.map === "function";
        }, function () {
            return typeof HTMLElement.prototype.insertAdjacentHTML === "function";
        }, function () {
            return window.requestAnimationFrame || ["ms", "moz", "webkit", "o"].some(function (vendor) {
                return typeof window[vendor + "RequestAnimationFrame"] === "function";
            });
        }, function () {
            return !!document.documentElement.classList;
        }, function () {
            return typeof window.matchMedia === "function";
        }, function () {
            return !!window["FormData"];
        }, function () {
            return !!window["Promise"];
        }],
            feature;
        feature = featuresThatHaveToBeInBrowser.shift();
        while (feature) {
            if (!feature()) {
                return true;
            }
            feature = featuresThatHaveToBeInBrowser.shift();
        }
        return false;
    })();


export default class IsSupport {
    get isOldBrowser() {
        return isOldBrowser;
    }
    get touchEvents() {
        return isBrowserSupportTouchEvents;
    }
    get dateTimeInput() {
        return isBrowserSupportDateTimeInput;
    }
    get localDateTimeInput() {
        return isBrowserSupportLocalDateTimeInput;
    }
    get dateInput() {
        return isBrowserSupportDateInput;
    }
    get slider() {
        return isBrowserSupportSlider;
    }
    get timeInput() {
        return isBrowserSupportTimeInput;
    }
}