interface IUser {
    name: string;
    color: string;
}

export default class User implements IUser {
    constructor(public name: string, public color: string) {
    }
}
