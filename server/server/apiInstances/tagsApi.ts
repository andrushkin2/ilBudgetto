import { IIdEntity } from "../../wwwroot/ilBudgetto";
import { IApiEntity } from "../api";
import DataBase from "../dbInstance";


export interface INewTag {
    name: string;
}

export interface ITag extends INewTag, IIdEntity {}

export interface ITagSearch extends Partial<ITag> {}

export default class TagApi implements IApiEntity<INewTag, ITagSearch> {
    private get = "SELECT * FROM tags";

    public Add(db: DataBase, entity: INewTag) {
        let sql = `INSERT INTO tags(name) VALUES('${entity.name}')`;
        return db.insert(sql).then(id => {
            return this.Get(db, { id: id.toString() });
        });
    }

    public Remove(db: DataBase, entity: IIdEntity) {
        let sql = `DELETE FROM tags WHERE id = '${ entity.id }'`;
        return db.remove(sql).then(() => ([{ id: entity.id }]));
    }

    public Get(db: DataBase, search?: ITagSearch) {
        let parts: string[] = [];
        if (search && Object.keys(search).length > 0) {
            if (search.id) {
                parts.push(`id = '${search.id}'`);
            } else {
                search.name && parts.push(`name LIKE '%${search.name}%'`);
            }
        } else {
            parts = ["1"];
        }

        let sql = `${this.get} WHERE ${parts.join(" AND ")}`;
        return db.all<ITag>(sql);
    }

    public Set(db: DataBase, entity: ITag) {
        let sql = `UPDATE tags SET name = '${entity.name}' WHERE id = '${entity.id}'`;
        return db.all<IIdEntity>(sql).then(() => {
            return this.Get(db, { id: entity.id });
        });
    }
}