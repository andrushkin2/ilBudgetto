
const toServerDate = (localDate: Date) => Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0);

const parseServerDate = (serverDate: number) => {
    let date = new Date(serverDate);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0);
};

export { toServerDate, parseServerDate };