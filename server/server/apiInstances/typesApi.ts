import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";

export interface INewType {
    name: string;
    icon: string;
}

export interface IType extends IIdEntity, INewType {}

export interface ITypeSearch extends Partial<IType> {}

export default class TypesApi implements IApiEntity<INewType, ITypeSearch> {
    private get = "SELECT * FROM types";

    public Add(db: DataBase, entity: INewType) {
        let sql = `INSERT INTO types(name, icon) VALUES('${entity.name}', '${entity.icon}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        if (entity.id === "0" || entity.id === "1") {
            return Promise.reject(new Error("Not enaugh permissions"));
        }

        let sql = `DELETE FROM types WHERE id = '${entity.id}'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: ITypeSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                search.name && parts.push(`name LIKE '%${search.name}%'`);
                search.icon && parts.push(`icon LIKE '%${search.icon}%'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<IType>(sql);
    }

    public Set(db: DataBase, entity: IType) {
        let sql = `UPDATE types SET name = '${entity.name}', email = '${entity.icon}' WHERE id = '${entity.id}'`;
        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}