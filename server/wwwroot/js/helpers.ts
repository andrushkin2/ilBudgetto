let isUsualObject = function (obj) {
    return Object.prototype.toString.call(obj).indexOf("Object") !== -1;
};

interface IExtend {
    <T1, T2>(isDeepClone: boolean, target: T1, source: T2): T1 & T2;
    <T1, T2, T3>(isDeepClone: boolean, target: T1, source1: T2, source2: T3): T1 & T2 & T3;
    <T1, T2, T3, T4>(isDeepClone: boolean, target: T1, source1: T2, source2: T3, source3: T4): T1 & T2 & T3 & T4;
    <T1, T2, T3, T4, T5>(isDeepClone: boolean, target: T1, source1: T2, source2: T3, source3: T4, source4: T5): T1 & T2 & T3 & T4 & T5;
    (isDeepClone: boolean, target: any, ...source: any[]): any;
    <T1, T2>(target: T1, source: T2): T1 & T2;
    <T1, T2, T3>(target: T1, source1: T2, source2: T3): T1 & T2 & T3;
    <T1, T2, T3, T4>(target: T1, source1: T2, source2: T3, source3: T4): T1 & T2 & T3 & T4;
    <T1, T2, T3, T4, T5>(target: T1, source1: T2, source2: T3, source3: T4, source4: T5): T1 & T2 & T3 & T4 & T5;
    (target: any, ...source: any[]): any;
}

let extend: IExtend = function (...rest) {
    var length = rest.length,
        src, srcKeys, srcAttr,
        fullCopy = false,
        resAttr,
        res = rest[0], i = 1, j;

    if (typeof res === "boolean") {
        fullCopy = res;
        res = rest[1];
        i++;
    }
    while (i !== length) {
        src = rest[i];
        srcKeys = Object.keys(src);
        for (j = 0; j < srcKeys.length; j++) {
            srcAttr = src[srcKeys[j]];
            if (fullCopy && (isUsualObject(srcAttr) || Array.isArray(srcAttr))) {
                resAttr = res[srcKeys[j]];
                resAttr = res[srcKeys[j]] = (isUsualObject(resAttr) || Array.isArray(resAttr)) ? resAttr : (Array.isArray(srcAttr) ? [] : {});
                extend(fullCopy, resAttr, srcAttr);
            } else {
                res[srcKeys[j]] = src[srcKeys[j]];
            }
        }
        i++;
    }
    return res;
};

const show = (el: HTMLElement) => {
    el.style.display = "";
};

const hide = (el: HTMLElement) => {
    el.style.display = "none";
};

export { extend, show, hide };