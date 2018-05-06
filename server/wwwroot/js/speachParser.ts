
export interface ISpaechRecognize extends IMoneyParse {
    comment: string;
}

interface IMoneyParse {
    value: number;
    currency: {
        id: number;
        name: string;
    };
}

export default class SpeachParser {

    private moneyReg = /(\d+\s?[р|к|\$]?(доллар(а|ов)?)?(цент(а|ов)?)?)/gm;
    private typeReg = /(\s?(затрат(ы|а)?)|(прибыл(ь|и)?)|(плюс(ани|ы|ик)?)|(минус(ани|ы|ик)?)|(\-)|(\+)\s?)?/gm;
    public recognize(text: string): ISpaechRecognize | Error {
        let trimmed = text.trim();

        let money = trimmed.match(this.moneyReg);

        let result = this.parseMoney(money);

        if (result instanceof Error) {
            return result;
        }

        if (money) {
            money.forEach(txt => {
                trimmed = trimmed.replace(txt, "");
            });
            trimmed.trim();
        }

        let types = trimmed.match(this.typeReg);
        let accum = this.parseType(types);

        result.value *= accum;

        if (types) {
            types.forEach(txt => {
                trimmed = trimmed.replace(txt, "");
            });
            trimmed.trim();
        }

        return {...result, ...{
            comment: trimmed.trim() || ""
        }};
    }

    private parseType(text: RegExpMatchArray | null) {
        if (!text) {
            return -1;
        }

        for (let i = 0, len = text.length; i < len; i++) {
            let txt = text[i].trim();
            if (!txt) {
                continue;
            }

            if (txt.indexOf("прибыл") !== -1 || txt.indexOf("плюс") !== -1 || txt.indexOf("+") !== -1) {
                return 1;
            }
            if (txt.indexOf("затрат") !== -1 || txt.indexOf("минус") !== -1 || txt.indexOf("-") !== -1) {
                return -1;
            }
        }

        return -1;
    }

    private parseMoney(moneyText: RegExpMatchArray | null): IMoneyParse | Error {
        if (!moneyText) {
            return new Error("Cannot recognize value");
        }

        let bigPart = "";
        let smallPart = "";
        let currency: {
                id: number;
                name: string;
            } | undefined;

        let bigReg = /([р|\$]?(доллар(а|ов)?)?)/gm;

        for (let i = 0, len = moneyText.length; i < len; i++) {
            let text = moneyText[i];

            if (!bigPart && bigReg.test(text)) {
                let num = this.getDigit(text);

                if (num === undefined) {
                    continue;
                }

                currency = this.parseCurrency(text);

                if (currency === undefined) {
                    continue;
                }

                bigPart = `${num}`;
            } else if (!smallPart) {
                let num = this.getDigit(text);

                if (num === undefined) {
                    continue;
                }

                if (!bigPart && !currency) {
                    currency = this.parseCurrency(text);
                }

                smallPart = `${ num }`;
            }

            if (bigPart && smallPart) {
                break;
            }
        }

        let value = parseFloat(`${ bigPart }.${ smallPart || 0 }`);

        if (!isNaN(value)) {
            return {
                value,
                currency: currency || { id: 2, name: "BYN" }
            };
        }

        return new Error("Cannot recognize value");
    }

    private getDigit(text: string) {
        let digit = /(\d+)/gm;
        let res = text.match(digit);

        if (res !== null && res.length === 1) {
            let num = parseInt(res[0]);

            if (!isNaN(num)) {
                return num;
            }
        }

        return undefined;
    }

    private parseCurrency(text: string) {
        if (text.indexOf("оллар") !== -1 || text.indexOf("цент") !== -1 || text.indexOf("$") !== -1) {
            return { id: 1, name: "USD" };
        }

        if (text.indexOf("р") !== -1) {
            return { id: 2, name: "BYN" };
        }

        return undefined;
    }
}