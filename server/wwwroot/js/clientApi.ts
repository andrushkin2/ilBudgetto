import { IApiCall } from "../../server/api";
import { IServerError } from "../../server";
import { ServerError } from "./errors";

export default class ClientApi {
    private host: string;
    constructor(serverHost: string) {
        this.host = serverHost;
    }

    public call<ApiCallType, ResultEntity>(api: IApiCall<ApiCallType>, method: "POST" | "GET") {
        let body = JSON.stringify(api);

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Content-Length", body.length.toString());
        headers.append("Origin", location.origin);

        return fetch(`${this.host}/api`, {
            method: method,
            headers,
            cache: "no-store",
            credentials: "same-origin",
            mode: "same-origin",
            body: body
        }).then(response => {
            let contentType = response.headers.get("Content-Type");
            if (response.ok && response.status === 200 && contentType && contentType.indexOf("application/json") === 0) {
                return response.json();
            }

            throw new ServerError({
                isError: true,
                type: "ApiError",
                message: "Unknown error on api call"
            });
        }).then((res: ResultEntity[] | IServerError) => {
            if ("isError" in res && "type" in res && "message" in res) {
                throw new ServerError(res);
            }

            if (!res) {
                return [];
            }

            let result = Array.isArray(res) ? res : [res];

            return result;
        });
    }

    post<ApiCallType, ResultEntity>(api: IApiCall<ApiCallType>) {
        return this.call<ApiCallType, ResultEntity>(api, "POST");
    }
}