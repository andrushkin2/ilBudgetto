import { App } from "./server/expressInstance";
import * as http from "http";
import DbManager from "./server/dbManager";
import Api from "./server/api";
import { UsersDBName } from "./server/dbInstance";

export interface IServerError {
    message: string;
    isError: boolean;
    type: "ServerError" | "ApiError";
}

const DB_MANAGER = new DbManager(UsersDBName);

const api = new Api(DB_MANAGER);

App.post("/api", (req, res, next) => {
    api.parseRequest(req.body).then(entity => {
        res.contentType("application/json");
        res.statusCode = 200;
        res.json(entity);
        next();
    }).catch(e => {
        let message = `Unknown API error: ${ e.toString() }`;

        if (e instanceof Error) {
            console.warn(e);
            message = e.message;
        }

        let err: IServerError = {
            isError: true,
            message,
            type: "ApiError"
        };
        res.contentType("application/json");
        res.statusCode = 500;
        res.json(err);
        next();
    });
});

http.createServer(App).listen(8080);
