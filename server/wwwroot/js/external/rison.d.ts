interface Rison {
    encode: (obj: any) => string,
    decode: (str: string) => any,
    encode_object: (obj: any) => string
}

declare var rison: Rison;