import ClientApi from "./clientApi";
import { IUserSearch, IUser, INewUser } from "../../server/apiInstances/usersApi";
import { IIdEntity } from "../ilBudgetto";
import { IIncomingSearch, IIncoming, INewIncoming } from "../../server/apiInstances/incomingApi";


export default class EntityLoader {
    private api: ClientApi;
    constructor(api: ClientApi) {
        this.api = api;
    }
    public readonly user = {
        get: (search?: IUserSearch) => this.api.post<IUserSearch, IUser>({
            entity: search as IUserSearch,
            method: "Get",
            type: "User"
        }),
        add: (user: INewUser) => this.api.post<INewUser, IUser>({
            entity: user,
            method: "Add",
            type: "User"
        }),
        remove: (user: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: user,
            method: "Remove",
            type: "User"
        }),
        set: (user: IUser) => this.api.post<IUser, IUser>({
            entity: user,
            method: "Add",
            type: "User"
        })
    };

    public readonly incoming = {
        get: (search?: IIncomingSearch) => this.api.post<IIncomingSearch, IIncoming>({
            entity: search as IIncomingSearch,
            method: "Get",
            type: "Incoming"
        }),
        add: (incoming: INewIncoming) => this.api.post<INewIncoming, IIncoming>({
            entity: incoming,
            method: "Add",
            type: "Incoming"
        }),
        remove: (incoming: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: incoming,
            method: "Remove",
            type: "Incoming"
        }),
        set: (incoming: IIncoming) => this.api.post<IIncoming, IIncoming>({
            entity: incoming,
            method: "Set",
            type: "Incoming"
        })
    };
}