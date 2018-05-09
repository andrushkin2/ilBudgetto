
const toServerDate = (localDate: Date) => Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0);

const parseServerDate = (serverDate: number) => {
    let date = new Date(serverDate);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0);
};

const getLastDate = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 0, 0, 0).getDate();

export interface IDatePeriod {
    fromDate: Date;
    toDate: Date;
}

const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());

const getMonthPeriod = (date: Date): IDatePeriod => {
    let startDate = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    let endDate = new Date(date.getFullYear(), date.getMonth(), getLastDate(date), 23, 59, 59, 999);

    return {
        fromDate: startDate,
        toDate: endDate
    };
};

export { toServerDate, parseServerDate, getMonthPeriod, getLastDate, addDays };