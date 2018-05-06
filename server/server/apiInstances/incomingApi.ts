import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { Partial } from "./usersApi";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";


interface ISearchDateTimeTemp {
    fromDate: number;
    toDate: number;
}

export interface ISearchDateTime extends Partial<ISearchDateTimeTemp> {}

export interface IPartOfIncoming {
    value: number;
    isActive: number;
    typeId: number;
    currencyId: number;
    comment: string;
    tags: string;
}

export interface IDateOfIncoming {
    date: number;
}

export interface INewIncoming extends IPartOfIncoming, IDateOfIncoming {}

export interface IIncoming extends IPartOfIncoming, IDateOfIncoming, IIdEntity {}

export interface IIncomingSearch extends Partial<IPartOfIncoming>, Partial<IIdEntity>, ISearchDateTime {}


export default class IncomingApi implements IApiEntity<INewIncoming, IIncomingSearch> {
    private get = "SELECT * FROM incoming";

    public Add(db: DataBase, entity: INewIncoming) {
        let sql = `INSERT INTO
                        incoming(date, value, isActive, typeId, currencyId, comment, tags)
                    VALUES('${entity.date}', '${entity.value}', '${entity.isActive}', '${entity.typeId}', '${entity.currencyId}', '${entity.comment}', '${entity.tags}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        let sql = `DELETE FROM incoming WHERE id = '${entity.id}'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: IIncomingSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                search.comment && parts.push(`comment LIKE '%${search.comment}%'`);
                search.currencyId && parts.push(`currencyId = '${search.currencyId}'`);
                search.fromDate && parts.push(`date >= '${search.fromDate}'`);
                search.toDate && parts.push(`date <= '${search.toDate}'`);
                search.isActive && parts.push(`isActive = '${search.isActive}'`);
                search.tags && parts.push(`tags LIKE '%${search.tags}%'`);
                search.typeId && parts.push(`typeId = '${search.tags}'`);
                search.value && parts.push(`value = '${search.value}'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<IIncoming>(sql);
    }

    public Set(db: DataBase, entity: IIncoming) {
        let sql = `UPDATE incoming
                    SET date = '${entity.date}', value = '${entity.value}',
                        isActive = '${entity.isActive}', typeId = '${entity.typeId}',
                        currencyId = '${entity.currencyId}', comment = '${entity.comment}',
                        tags = '${entity.tags}'
                    WHERE id = '${entity.id}'`;

        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}