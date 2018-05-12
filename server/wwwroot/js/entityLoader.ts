import ClientApi from "./clientApi";
import { IUserSearch, IUser, INewUser } from "../../server/apiInstances/usersApi";
import { IIdEntity } from "../ilBudgetto";
import { IIncomingSearch, IIncoming, INewIncoming } from "../../server/apiInstances/incomingApi";
import { ICurrencySearch, ICurrency } from "../../server/apiInstances/currencyApi";
import { ITypeSearch, INewType, IType } from "../../server/apiInstances/typesApi";
import { IStableWasteSearch, IStableWaste, INewStableWaste } from "../../server/apiInstances/stableWaste";
import { IStableIncomeSearch, INewStableIncome, IStableIncome } from "../../server/apiInstances/stableIncome";
import { ITagSearch, ITag, INewTag } from "../../server/apiInstances/tagsApi";


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

    public readonly currency = {
        get: (search?: ICurrencySearch) => this.api.post<ICurrencySearch, ICurrency>({
            entity: search as ICurrencySearch,
            method: "Get",
            type: "Currency"
        })
    };

    public readonly types = {
        get: (search?: ITypeSearch) => this.api.post<ITypeSearch, ICurrency>({
            entity: search as ITypeSearch,
            method: "Get",
            type: "Types"
        }),
        add: (type: INewType) => this.api.post<INewType, IType>({
            entity: type,
            method: "Add",
            type: "Types"
        }),
        remove: (type: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: type,
            method: "Remove",
            type: "Types"
        }),
        set: (type: IType) => this.api.post<IType, IType>({
            entity: type,
            method: "Set",
            type: "Types"
        })
    };

    public readonly stableWaste = {
        get: (search?: IStableWasteSearch) => this.api.post<IStableWasteSearch, IStableWaste>({
            entity: search as IStableWasteSearch,
            method: "Get",
            type: "StableWaste"
        }),
        add: (type: INewStableWaste) => this.api.post<INewStableWaste, IStableWaste>({
            entity: type,
            method: "Add",
            type: "StableWaste"
        }),
        remove: (type: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: type,
            method: "Remove",
            type: "StableWaste"
        }),
        set: (type: IStableWaste) => this.api.post<IStableWaste, IStableWaste>({
            entity: type,
            method: "Set",
            type: "StableWaste"
        })
    };

    public readonly stableIncome = {
        get: (search?: IStableIncomeSearch) => this.api.post<IStableIncomeSearch, IStableIncome>({
            entity: search as IStableIncomeSearch,
            method: "Get",
            type: "StableIncome"
        }),
        add: (type: INewStableIncome) => this.api.post<INewStableIncome, IStableIncome>({
            entity: type,
            method: "Add",
            type: "StableIncome"
        }),
        remove: (type: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: type,
            method: "Remove",
            type: "StableIncome"
        }),
        set: (type: IStableIncome) => this.api.post<IStableIncome, IStableIncome>({
            entity: type,
            method: "Set",
            type: "StableIncome"
        })
    };

    public readonly tags = {
        get: (search?: ITagSearch) => this.api.post<ITagSearch, ITag>({
            entity: search as ITagSearch,
            method: "Get",
            type: "Tags"
        }),
        add: (type: INewTag) => this.api.post<INewTag, INewTag>({
            entity: type,
            method: "Add",
            type: "Tags"
        }),
        remove: (type: IIdEntity) => this.api.post<IIdEntity, IIdEntity>({
            entity: type,
            method: "Remove",
            type: "Tags"
        }),
        set: (type: ITag) => this.api.post<ITag, ITag>({
            entity: type,
            method: "Set",
            type: "Tags"
        })
    };
}