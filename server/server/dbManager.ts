import DataBase, { GetDBName } from "./dbInstance";

interface IDbInstances {
    [key: string]: DataBase | undefined;
}

const getPathToDb = (dbName: string) => `${ __dirname }/../db/${ dbName }`;

export default class DbManager {
    private instances: IDbInstances = {};
    constructor(mainDBName: string) {
        try {
            let mainDb = new DataBase(getPathToDb(GetDBName(mainDBName)));
            this.instances[mainDBName] = mainDb;
        } catch (e) {
            console.warn(`Cannot cannect to the DB "${ mainDBName }": ${ e.toString() }`);
        }
    }

    private getInstance(dbName: string) {
        let fullName = GetDBName(dbName);

        try {
            let mainDb = new DataBase(getPathToDb(fullName));
            this.instances[dbName] = mainDb;
        } catch (e) {
            console.warn(`Cannot cannect to the DB "${dbName}": ${e.toString()}`);
        }

        return this.instances[dbName];
    }

    public getDatabase(userId: string) {
        let instance = this.instances[userId];

        if (instance instanceof DataBase) {
            return instance;
        }

        instance = this.getInstance(userId);

        return instance;
    }
}