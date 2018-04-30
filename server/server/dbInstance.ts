import * as sqlite3 from "sqlite3";

const getDBName = (userId: string) => `userDB_${ userId }.db`;

export { getDBName as GetDBName };

export default class DataBase {
    private dbName: string;
    private db: sqlite3.Database;
    constructor(dbPath: string) {
        this.dbName = dbPath;

        this.db = new sqlite3.Database(this.dbName, e => {
            throw e || new Error(`Cannot connect to DataBase "${ this.dbName }"`);
        });
    }
    public close() {
        this.db.close();
    }
}