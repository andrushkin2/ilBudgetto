import { IIdEntity } from "../wwwroot/ilBudgetto";

export interface IApiEntity<T, Search> {
    add: (entity: T) => (T & IIdEntity)[];
    remove: (entity: IIdEntity) => IIdEntity[];
    set: (entity: T & IIdEntity) => (T & IIdEntity)[];
    get: (search?: Search) => (T & IIdEntity)[];
}

export default class Api {
    constructor() {

    }
}