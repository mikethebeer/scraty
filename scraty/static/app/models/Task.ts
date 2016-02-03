import User from "./User";

interface ITask {
    id: string;
    story_id: string;
    text: string;
    user: User;
    state: number;
}

export default class Task implements ITask {
    constructor(public id: string, public story_id: string, public text: string, public user: User, public state: number) {
    }
}
