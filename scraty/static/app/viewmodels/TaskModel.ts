import UserModel from "./UserModel";
import StoryModel from "./StoryModel";
import Task from "../models/Task";
import ITask from "../models/Task";
import User from "../models/User";
import {DataService} from "../data_service";
import ko = require("knockout");

export default class TaskModel {

    public id: string;
    public story_id: KnockoutObservable<string>;
    public text: KnockoutObservable<string>;
    public user: KnockoutObservable<UserModel>;
    public state: KnockoutObservable<number>;
    public isOpen: KnockoutObservable<boolean>;
    public markdownText: KnockoutComputed<string>;

    constructor(task: ITask) {
        this.id = task.id;
        this.user = ko.observable(new UserModel(task.user));
        this.story_id = ko.observable(task.story_id);
        this.text = ko.observable(task.text);
        this.state = ko.observable(task.state);
        this.isOpen = ko.observable(task.text == "");
        this.markdownText = ko.computed(function() {
            return markdown.toHTML(this.text());
        }, this);
    }

    public open() {
        this.isOpen(true);
    }

    public close() {
        this.isOpen(false);
    }

    public saveTask(taskModel: TaskModel) {
        if (taskModel.id == undefined) {
            var newUser = new User(taskModel.user().toString(), "#fff");
            var newTaskModel = new TaskModel(
                new Task(taskModel.id, taskModel.story_id(), taskModel.text(), newUser, 0)
            );
            DataService.addTask(newTaskModel.asTask());
        } else {
            DataService.updateTask(taskModel.asTask());
        }
        this.close();
    }

    public removeTask(task: Task) {
        // removal from DOM is done via websocket delete event
        DataService.deleteTask(task);
    }

    public asTask() : Task {
        return this.toTask(this);
    }

    private toTask (taskModel: TaskModel) : Task {
        return {
            id: taskModel.id,
            text: taskModel.text(),
            state: taskModel.state(),
            story_id: taskModel.story_id(),
            user: taskModel.user().asUser()
        };
    }
}
