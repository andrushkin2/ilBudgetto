import { App } from "./server/expressInstance";
import * as http from "http";
import DbManager from "./server/dbManager";
import Api from "./server/api";

const DBManager = new DbManager("testDB");

const api = new Api();

App.post("/api", (req, res, next) => {
    debugger;
});

http.createServer(App).listen(8080);
