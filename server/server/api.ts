import { IIdEntity } from "../wwwroot/ilBudgetto";
import DbManager from "./dbManager";
import UsersApi from "./apiInstances/usersApi";
import DataBase, { UsersDBName } from "./dbInstance";
import IncomingApi from "./apiInstances/incomingApi";

export interface IApiEntity<T, Search> {
    Add: (db: DataBase, entity: T) => PromiseLike<(T & IIdEntity)[]>;
    Remove: (db: DataBase, entity: IIdEntity) => PromiseLike<IIdEntity[]>;
    Set: (db: DataBase, entity: T & IIdEntity) => PromiseLike<(T & IIdEntity)[]>;
    Get: (db: DataBase, search?: Search) => PromiseLike<(T & IIdEntity)[]>;
}

const apies = {
    User: new UsersApi(),
    Incoming: new IncomingApi()
};

type IApiType = "User" | "Incoming";
type IApiMethod = "Get" | "Set" | "Remove" | "Add";

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
    public parseRequest(req: IApiCall<any>) {
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
    private getApi(type: IApiType) {
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