import User from "../models/User";
import IUser from "../models/User";
import {DataService} from "../data_service";
import ko = require("knockout");

export default class UserModel {

    public name: KnockoutObservable<string>;
    public color: KnockoutObservable<string>;

    constructor(user: IUser) {
        this.name = ko.observable(user.name);
        this.color = ko.observable(user.color);
    }

    public saveUser(userModel: UserModel) {
        DataService.updateUser(this.asUser());
    }

    public asUser(): User {
        return this.toUser(this);
    }

    private toUser(userModel: UserModel): User {
        return {
            name: userModel.name(),
            color: userModel.color()
        }
    }
}
