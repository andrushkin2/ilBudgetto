import { IIdEntity } from "../wwwroot/ilBudgetto";
import DbManager from "./dbManager";
import UsersApi from "./apiInstances/usersApi";
import DataBase, { UsersDBName } from "./dbInstance";
import IncomingApi from "./apiInstances/incomingApi";
import CurrencyApi from "./apiInstances/currencyApi";
import TypesApi from "./apiInstances/typesApi";
import StableWaste from "./apiInstances/stableWaste";
import StableIcome from "./apiInstances/stableIncome";
import TagApi from "./apiInstances/tagsApi";

export interface IApiEntity<T, Search> {
    Add: (db: DataBase, entity: T) => PromiseLike<(T & IIdEntity)[]>;
    Remove: (db: DataBase, entity: IIdEntity) => PromiseLike<IIdEntity[]>;
    Set: (db: DataBase, entity: T & IIdEntity) => PromiseLike<(T & IIdEntity)[]>;
    Get: (db: DataBase, search?: Search) => PromiseLike<(T & IIdEntity)[]>;
}

const apies = {
    User: new UsersApi(),
    Incoming: new IncomingApi(),
    Currency: new CurrencyApi(),
    Types: new TypesApi(),
    StableWaste: new StableWaste(),
    StableIncome: new StableIcome(),
    Tags: new TagApi()
};

export type IApiType = "User" | "Incoming" | "Currency" | "Types" | "StableWaste" | "StableIncome" | "Tags";
export type IApiMethod = "Get" | "Set" | "Remove" | "Add";

export interface IApiCall<T extends any> {
    type: IApiType;
    method: IApiMethod;
    entity: T;
}

export default class Api {
    private dbManager: DbManager;
    constructor(dbManage: DbManager) {
        this.dbManager = dbManage;
    }
    public parseRequest<T extends any>(req: IApiCall<T>) {
        let api = this.getApi(req.type);
        if (api instanceof Error) {
            return Promise.reject(api);
        }

        let method = req.method;
        let checkMethod = this.checkMethod(method, api);
        if (checkMethod instanceof Error) {
            return Promise.reject(checkMethod);
        }

        let db = this.getDbInstance(req.type);
        if (db instanceof Error) {
            return Promise.reject(db);
        }

        return (api[method] as any)(db, req.entity);
    }
    public getApi(type: IApiType) {
        if (type && type in apies) {
            return apies[type];
        }

        return new Error("Wrong type of call");
    }

    private getDbInstance(type: IApiType) {
        let instance: DataBase | undefined;
        if (type === "User") {
            instance = this.dbManager.getDatabase(UsersDBName);
        } else {
            instance = this.dbManager.getDatabase("userDB_1");
        }

        if (!instance) {
            return new Error("Cannot run request in DB");
        }

        return instance;
    }

    private checkMethod(method: IApiMethod, api: IApiEntity<any, any>) {
        if (method in api) {
            return undefined;
        }

        return new Error("Wrong method of call");
    }
}