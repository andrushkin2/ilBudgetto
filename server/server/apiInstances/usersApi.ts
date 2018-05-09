import { IApiEntity } from "../api";
import { IIdEntity } from "../../wwwroot/ilBudgetto";
import DataBase from "../dbInstance";

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export interface INewUser {
    email: string;
    name: string;
    lastValue: string;
    lastDate: number;
}

export interface IUser extends IIdEntity, INewUser {}

export interface IUserSearch extends Partial<IUser> {}

export default class UsersApi implements IApiEntity<INewUser, IUserSearch> {
    private get = "SELECT * FROM users";
    public Add(db: DataBase, entity: INewUser) {
        let sql = `INSERT INTO users(name, email) VALUES('${entity.name}', '${entity.email}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        if (entity.id === "0") {
            return Promise.reject(new Error("Not enaugh permissions"));
        }
        let sql = `DELETE FROM users WHERE id = '${ entity.id }'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: IUserSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${ search.id }'`);
            } else {
                search.name && parts.push(`name LIKE '%${search.name}%'`);
                search.email && parts.push(`email LIKE '%${search.email}%'`);
                search.lastDate && parts.push(`lastDate = '${search.email}'`);
                search.lastValue && parts.push(`lastValue = '${search.email}'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<IUser>(sql);
    }

    public Set(db: DataBase, entity: IUser) {
        let sql = `UPDATE users SET name = '${entity.name}', email = '${ entity.email }' where id = '${entity.id}'`;
        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}