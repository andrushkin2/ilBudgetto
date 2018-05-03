import { IApiEntity } from "../api";
import { IIdEntity } from "../../wwwroot/ilBudgetto";

type Partial<T> = {
    [P in keyof T]?: T[P];
};

export interface INewUser {
    email: string;
    name: string;
}

export interface IUser extends IIdEntity, INewUser {}

export interface IUserSearch extends Partial<IUser> {}

export default class UsersApi implements IApiEntity<INewUser, IUserSearch> {
    public add(entity) {
        let newObject: IUser = { ...entity, ...{id: "asd"} };
        return Promise.resolve([newObject]);
    }

    public remove(entity: IIdEntity) {
        return Promise.resolve([entity]);
    }

    public get(search?: IUserSearch) {
        if (search) {
            return Promise.resolve([] as IUser[]);
        }
        return Promise.resolve([] as IUser[]);
    }

    public set(entity: IUser) {
        return Promise.resolve([entity]);
    }
}