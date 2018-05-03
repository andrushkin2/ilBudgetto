import { IIdEntity } from "../wwwroot/ilBudgetto";

export interface IApiEntity<T, Search> {
    add: (entity: T) => PromiseLike<(T & IIdEntity)[]>;
    remove: (entity: IIdEntity) => PromiseLike<IIdEntity[]>;
    set: (entity: T & IIdEntity) => PromiseLike<(T & IIdEntity)[]>;
    get: (search?: Search) => Promise<(T & IIdEntity)[]>;
}

export default class Api {
    constructor() {

    }
}