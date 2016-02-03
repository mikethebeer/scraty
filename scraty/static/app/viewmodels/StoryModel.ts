/// <reference path="../knockout/knockout.d.ts" />
/// <reference path="../markdown/markdown.d.ts" />
import TaskModel from "./TaskModel";
import BoardViewModel from "./BoardViewModel";
import Story from "../models/Story";
import User from "../models/User";
import IStory from "../models/Story";
import Task from "../models/Task";
import {DataService} from "../data_service";

import ko = require("knockout");
import markdown = require("markdown");

export default class StoryModel {

    public id: string;
    public link: KnockoutObservable<string>;
    public position: KnockoutObservable<number>;
    public tasks: KnockoutObservableArray<TaskModel>;
    public todoTasks: KnockoutObservableArray<TaskModel>;
    public inProgressTasks: KnockoutObservableArray<TaskModel>;
    public verifyTasks: KnockoutObservableArray<TaskModel>;
    public doneTasks: KnockoutObservableArray<TaskModel>;
    public text: KnockoutObservable<string>;
    public isOpen: KnockoutObservable<boolean>;
    public markdownText: KnockoutComputed<string>;

    constructor(story: IStory) {
        this.id = story.id;
        this.link = ko.observable(story.link);
        this.position = ko.observable(story.position);
        this.tasks = ko.observableArray([]);
        story.tasks.forEach(t => {
            this.tasks.push(new TaskModel(t));
        });
        this.text = ko.observable(story.text);
        this.todoTasks = this.tasks.filterByProperty("state", 0)
        this.inProgressTasks = this.tasks.filterByProperty("state", 1)
        this.verifyTasks = this.tasks.filterByProperty("state", 2)
        this.doneTasks = this.tasks.filterByProperty("state", 3)
        this.isOpen = ko.observable(story.text == "");
        this.markdownText = ko.computed(function() {
            return markdown.toHTML(this.text());
        }, this);
    }

    public addTask(storyModel: StoryModel) {
        this.tasks.push(new TaskModel(new Task(null, storyModel.id, "", new User("undefined", "#fff"), 0)));
    }

    public saveStory(vm: BoardViewModel) {
        if (this.id == undefined) {
            DataService.addStory(new Story(null, null, null, this.text()));
            vm.stories.remove(this);
        } else {
            var story = vm.stories.filterByProperty("id", this.id)[0];
            console.log(story);
            /* var story = {
                id: this.id,
                text: this.text(),
                link: "",
                position: 0
            };*/
            DataService.updateStory(story);
        }
        this.close();
    }

    public open() {
        this.isOpen(true);
    }

    public close() {
        this.isOpen(false);
    }

    public asStory(): Story {
        return this.toStory(this);
    }

    private toStory(storyModel: StoryModel) : Story {
        var taskArr : Task[] = [];
        storyModel.tasks().forEach((t: TaskModel) => {
            taskArr.push(t.asTask());
        });
        return {
            id: storyModel.id,
            link: storyModel.link(),
            position: storyModel.position(),
            text: storyModel.text(),
            tasks: taskArr
        }
    }
}

ko.observableArray.fn.filterByProperty = function(propName, matchValue) {
    return ko.pureComputed(function() {
        var allItems = this(), matchingItems = [];
        for (var i = 0; i < allItems.length; i++) {
            var current = allItems[i];
            if (ko.unwrap(current[propName]) === matchValue)
                matchingItems.push(current);
        }
        return matchingItems;
    }, this);
}
