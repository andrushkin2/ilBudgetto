import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { Partial } from "./usersApi";
import { ISearchDateTime } from "./incomingApi";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";


interface IPartOfStableIncome {
    value: number;
    currencyId: number;
}

interface IDateOfStableIncome {
    date: number;
}

export interface INewStableIncome extends IPartOfStableIncome, IDateOfStableIncome {}

export interface IStableIncome extends IPartOfStableIncome, IDateOfStableIncome, IIdEntity {}

export interface IStableIncomeSearch extends Partial<IPartOfStableIncome>, Partial<IIdEntity>, ISearchDateTime {}


export default class StableIcome implements IApiEntity<INewStableIncome, IStableIncomeSearch> {
    private get = "SELECT * FROM stable_income";

    public Add(db: DataBase, entity: INewStableIncome) {
        let sql = `INSERT INTO
                        stable_income(date, value, currencyId)
                    VALUES('${entity.date}', '${entity.value}', '${entity.currencyId}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        let sql = `DELETE FROM stable_income WHERE id = '${entity.id}'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: IStableIncomeSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                search.currencyId && parts.push(`currencyId = '${search.currencyId}'`);
                search.fromDate && parts.push(`date >= '${search.fromDate}'`);
                search.toDate && parts.push(`date <= '${search.toDate}'`);
                search.value && parts.push(`value = '${search.value}'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<IStableIncome>(sql);
    }

    public Set(db: DataBase, entity: IStableIncome) {
        let sql = `UPDATE stable_income
                    SET date = '${entity.date}', value = '${entity.value}',
                        currencyId = '${entity.currencyId}'
                    WHERE id = '${entity.id}'`;

        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}
