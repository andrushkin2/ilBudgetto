import { App } from "./server/expressInstance";
import * as https from "https";
import * as http from "http";
import DbManager from "./server/dbManager";
import Api, { IApiType, IApiMethod } from "./server/api";
import { UsersDBName } from "./server/dbInstance";
import * as fs from "fs";
import { IUser, IUserSearch } from "./server/apiInstances/usersApi";
import { getMonthPeriod, addMonths, toServerDate } from "./wwwroot/js/dateParser";
import { IIncomingSearch, IIncoming } from "./server/apiInstances/incomingApi";
import { IStableIncomeSearch, IStableIncome } from "./server/apiInstances/stableIncome";
import { IStableWasteSearch, IStableWaste } from "./server/apiInstances/stableWaste";

export interface IServerError {
    message: string;
    isError: boolean;
    type: "ServerError" | "ApiError";
}

const DB_MANAGER = new DbManager(UsersDBName);

const api = new Api(DB_MANAGER);

const getIncoming = (toDate: number): Promise<IIncoming[]> => api.parseRequest({
    entity: <IIncomingSearch>{
        toDate: toDate
    },
    method: "Get",
    type: "Incoming"
});

const getStableIncome = (toDate: number): Promise<IStableIncome[]> => api.parseRequest({
    entity: <IStableIncomeSearch>{
        toDate: toDate
    },
    method: "Get",
    type: "StableIncome"
});

const getStableWaste = (toDate: number): Promise<IStableWaste[]> => api.parseRequest({
    entity: <IStableWasteSearch>{
        toDate: toDate
    },
    method: "Get",
    type: "StableWaste"
});

const updateUserBudget = (entity: any, reqType: IApiType, method: IApiMethod) => {
    let isUserGet = (reqType === "User" && method === "Get");
    let isRelatedUpdate = (requestType: IApiType, requestMethod: IApiMethod) => requestMethod !== "Get" && (requestType === "Incoming" || requestType === "StableIncome" || requestType === "StableWaste");

    if (isUserGet || isRelatedUpdate(reqType, method)) {
        return api.parseRequest({
            entity: {
                id: "1"
            },
            method: "Get",
            type: "User"
        }).then((users: IUser[]) => {
            let user = users[0];
            let toDate = getMonthPeriod(addMonths(new Date(), -1)).toDate;

            let serverDate = toServerDate(toDate);

            if ((isUserGet && user.lastDate === serverDate) || (entity.date && entity.date <= serverDate)) {
                return Promise.resolve(entity);
            }

            return Promise.all([getIncoming(serverDate), getStableIncome(serverDate), getStableWaste(serverDate)]).then(data => {
                let sum = 0;

                data[0].forEach(value => {
                    sum += value.value;
                });

                data[1].forEach(value => {
                    sum += value.value;
                });

                data[2].forEach(value => {
                    sum += value.value;
                });

                return api.parseRequest({
                    method: "Set",
                    type: "User",
                    entity: {...user, ...<IUserSearch>{
                        lastDate: serverDate,
                        lastValue: sum
                    }}
                }) as Promise<IUser>;
            });
        }).then(() => Promise.resolve(entity));
    }

    return Promise.resolve(entity);
};

App.post("/api", (req, res, next) => {
    api.parseRequest(req.body).then(entity => updateUserBudget(entity, req.body.type, req.body.method)).then(entity => {
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


let options = {
    key: fs.readFileSync("./server/cert/hostkey.pem").toString(),
    cert: fs.readFileSync("./server/cert/hostcert.pem").toString()
};

http.createServer(App).listen(8080);
https.createServer(options, App).listen(8443);
