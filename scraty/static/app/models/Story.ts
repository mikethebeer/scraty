import Task from "./Task";

interface IStory {
    id?: string;
    text?: string;
    link?: string;
    position?: number;
    tasks?: Task[];
}

export default class Story implements IStory {
    constructor(public id?: string, public link?: string, public position?: number, public text?: string, public tasks?: Task[]) {
    }
}
