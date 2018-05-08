import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { ISearchDateTime } from "./incomingApi";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";

export interface IDateOfStableWaste {
    date: number;
}

interface IPartOfStableWaste {
    value: number;
    isActive: number;
    currencyId: number;
}

export interface INewStableWaste extends IPartOfStableWaste, IDateOfStableWaste {}

export interface IStableWaste extends IIdEntity, IPartOfStableWaste, IDateOfStableWaste {}

export interface IStableWasteSearch extends Partial<IPartOfStableWaste>, Partial<IIdEntity>, ISearchDateTime {}


export default class StableWaste implements IApiEntity<INewStableWaste, IStableWasteSearch> {
    private get = "SELECT * FROM stable_waste";

    public Add(db: DataBase, entity: INewStableWaste) {
        let sql = `INSERT INTO
                        stable_waste(date, value, isActive, currencyId)
                    VALUES('${entity.date}', '${entity.value}', '${entity.isActive}', '${entity.currencyId}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        let sql = `DELETE FROM stable_waste WHERE id = '${entity.id}'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: IStableWasteSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                search.currencyId && parts.push(`currencyId = '${search.currencyId}'`);
                search.fromDate && parts.push(`date >= '${search.fromDate}'`);
                search.toDate && parts.push(`date <= '${search.toDate}'`);
                search.isActive && parts.push(`isActive = '${search.isActive}'`);
                search.value && parts.push(`value = '${search.value}'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<IStableWaste>(sql);
    }

    public Set(db: DataBase, entity: IStableWaste) {
        let sql = `UPDATE stable_waste
                    SET date = '${entity.date}', value = '${entity.value}',
                        isActive = '${entity.isActive}',
                        currencyId = '${entity.currencyId}'
                    WHERE id = '${entity.id}'`;

        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}