/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="jqueryui.d.ts"/>
import {DataService} from './data_service';
import {Story} from './story';
import {Task} from './task';
import ko = require('knockout');


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


class TaskModel {

    id: string;
    story_id: KnockoutObservable<string>;
    text: KnockoutObservable<string>;
    user: KnockoutObservable<string>;
    user_id: KnockoutObservable<string>;
    state: KnockoutObservable<number>;

    constructor(task: Task) {
        this.id = task.id;
        this.text = ko.observable(task.text);
        this.user = ko.observable(task.user);
        this.user_id = ko.observable(task.user_id);
        this.state = ko.observable(task.state);
    }
}


class StoryModel {

    public tasks: KnockoutObservableArray<TaskModel>;
    public todoTasks: KnockoutObservableArray<TaskModel>;
    public inProgressTasks: KnockoutObservableArray<TaskModel>;
    public verifyTasks: KnockoutObservableArray<TaskModel>;
    public doneTasks: KnockoutObservableArray<TaskModel>;
    public text: string;

    constructor(public story: Story) {
        var arr : TaskModel[] = [];
        this.tasks = ko.observableArray(arr);
        story.tasks.forEach(t => {
            this.tasks.push(new TaskModel(t));
        });

        this.text = story.text;
        this.todoTasks = this.tasks.filterByProperty("state", 0)
        this.inProgressTasks = this.tasks.filterByProperty("state", 1)
        this.verifyTasks = this.tasks.filterByProperty("state", 2)
        this.doneTasks = this.tasks.filterByProperty("state", 3)
    }
}


class BoardViewModel {
    stories: KnockoutObservableArray<StoryModel>;
    private service: DataService;

    constructor(service: DataService) {
        var arr : StoryModel[] = [];
        this.stories = ko.observableArray(arr);
        this.service = service;

        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: StoryModel) => void> this.removeStory.bind(this);
    }

    removeStory(story: StoryModel) {
        this.stories.remove(story);
        this.service.deleteStory(story.story);
    }

    addStories(stories: Story[]) {
        for (var i = 0, len = stories.length; i < len; i++) {
            this.stories.push(new StoryModel(stories[i]));
        }
    }

    addStory(story: StoryModel) {
        this.stories.push(story);
    }

    updateStory(action: string, story: Story) {
        switch (action) {
            case 'added':
                this.stories.push(new StoryModel(story));
                break;
            case 'deleted':
                for (var i = 0; i < this.stories().length; i++) {
                    var storyModel = this.stories()[i];
                    if (story.id == storyModel.story.id) {
                        this.stories.remove(storyModel);
                    }
                }
                break;
        }
    }

    updateTask(action: string, task: Task) {
        for (var i = 0, len = this.stories().length; i < len; i++) {
            var storyModel = this.stories()[i];
            if (storyModel.story.id == task.story_id) {
                switch (action) {
                    case 'added':
                        storyModel.tasks.push(new TaskModel(task));
                    break;
                    case 'deleted':
                        for (var i = 0, len = storyModel.tasks().length; i < len; i++) {
                            var taskModel = storyModel.tasks()[i];
                            if (task.id == taskModel.id) {
                                storyModel.tasks.remove(taskModel);
                            }
                        }
                    break;
                }
            }
        }
    }
}


export class App {

    start() {
        $(document).ready(function() {
            var service = new DataService();
            var vm = new BoardViewModel(service)
            ko.applyBindings(vm);

            var ws = new WebSocket("ws://localhost:8080/websocket");
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                console.log(data);
                if (data.object_type == 'story') {
                    vm.updateStory(data.action, data.object);
                } else {
                    vm.updateTask(data.action, data.object);
                }
            };

            service.getAllStories().done(result => {
                vm.addStories(result.stories);

                $( ".task" ).draggable({cursor: "move"});
                $( ".state" ).droppable({
                    accept: ".task",
                    drop: function( event, ui ) {
                        changeState( ui.draggable, +$(this).attr('state') );
                        $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
                    }
                });
            });

            function changeState(item:JQuery, state:number) {
                var id = item.attr('id');
                var task = {"id": id, "state": state};
                service.updateTask(task);
            }
        });
    }
}
