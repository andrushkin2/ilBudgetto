import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";


export interface ICurrency extends IIdEntity {
    name: string;
}

export interface ICurrencySearch extends IIdEntity {}

export default class CurrencyApi implements IApiEntity<ICurrency, ICurrencySearch> {
    private get = "SELECT * FROM currency";
    public Add(_: DataBase, _1: ICurrency) {
        return Promise.resolve<ICurrency[]>([]);
    }

    public Remove(_: DataBase, _1: IIdEntity) {
        return Promise.resolve<ICurrency[]>([]);
    }

    public Get(db: DataBase, search?: ICurrencySearch) {
        let parts: string[] = [];

        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                new Error("ID should be in search request");
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<ICurrency>(sql);
    }

    public Set(_: DataBase, _1: ICurrency) {
        return Promise.resolve<ICurrency[]>([]);
    }
}