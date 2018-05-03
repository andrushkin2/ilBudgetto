import { App } from "./server/expressInstance";
import * as http from "http";
import DbManager from "./server/dbManager";
import Api from "./server/api";
import { UsersDBName } from "./server/dbInstance";

const DBManager = new DbManager(UsersDBName);

const api = new Api();

App.post("/api", (req, res, next) => {
    debugger;
});

http.createServer(App).listen(8080);
