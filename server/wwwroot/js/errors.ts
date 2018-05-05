import { IServerError } from "../../server";

export class ServerError extends Error {
    public readonly isServer = true;
    private errType: string;

    constructor(error: IServerError) {
        super(error.message);
        this.errType = error.type;
    }

    get type() {
        return this.errType;
    }
}