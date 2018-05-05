import * as sqlite3 from "sqlite3";

const usersDBName = "testDB";
const getDBName = (userId: string) => userId === usersDBName ? `${usersDBName}.db` : `userDB_${ userId }.db`;

export { getDBName as GetDBName, usersDBName as UsersDBName };

export default class DataBase {
    private dbName: string;
    private db: sqlite3.Database;
    constructor(dbPath: string) {
        this.dbName = dbPath;

        this.db = new sqlite3.Database(this.dbName, sqlite3.OPEN_READWRITE, e => {
            if (e instanceof Error) {
                throw e || new Error(`Cannot connect to DataBase "${ this.dbName }"`);
            } else {
                console.log(`Connected to DB: ${ this.dbName }`);
            }
        });
    }
    public all<T extends any>(sqlScript: string) {
        return new Promise<T[]>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.all(sqlScript, (err, row) => {
                    if (err instanceof Error) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        });
    }
    public insert(sqlScript: string) {
        return new Promise<number>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(sqlScript, function(err) {
                    if (err instanceof Error) {
                        reject(err);
                    } else {
                        resolve((this as any).lastID as number);
                    }
                });
            });
        });
    }
    public remove(sqlScript: string) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(sqlScript, function (err) {
                    if (err instanceof Error) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }
    public close() {
        this.db.close();
    }
}