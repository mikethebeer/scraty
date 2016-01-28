/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="jqueryui.d.ts"/>
import {DataService} from './data_service';
import {Story} from './story';
import {Task} from './task';
import ko = require('knockout');

var service = new DataService();


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
    state: KnockoutObservable<number>;
    isOpen: KnockoutObservable<boolean>;

    constructor(task: Task) {
        this.id = task.id;
        this.story_id = ko.observable(task.story_id);
        this.text = ko.observable(task.text);
        this.user = ko.observable(task.user);
        this.state = ko.observable(task.state);
        this.isOpen = ko.observable(task.text == "");
    }

    open() {
        this.isOpen(true);
    }

    close() {
        this.isOpen(false);
    }

    saveTask(taskModel: TaskModel) {
        var task = {
            id: taskModel.id,
            text: taskModel.text(),
            user: taskModel.user()
        };
        service.updateTask(task);
        this.close();
    }

    removeTask(task: Task) {
        // removal from DOM is done via websocket delete event
        service.deleteTask(task);
    }
}


class StoryModel {

    public tasks: KnockoutObservableArray<TaskModel>;
    public todoTasks: KnockoutObservableArray<TaskModel>;
    public inProgressTasks: KnockoutObservableArray<TaskModel>;
    public verifyTasks: KnockoutObservableArray<TaskModel>;
    public doneTasks: KnockoutObservableArray<TaskModel>;
    public text: KnockoutObservable<string>;
    public isOpen: KnockoutObservable<boolean>;

    constructor(public story: Story) {
        var arr : TaskModel[] = [];
        this.tasks = ko.observableArray(arr);
        story.tasks.forEach(t => {
            this.tasks.push(new TaskModel(t));
        });

        this.text = ko.observable(story.text);
        this.todoTasks = this.tasks.filterByProperty("state", 0)
        this.inProgressTasks = this.tasks.filterByProperty("state", 1)
        this.verifyTasks = this.tasks.filterByProperty("state", 2)
        this.doneTasks = this.tasks.filterByProperty("state", 3)
        this.isOpen = ko.observable(story.text == "");
    }

    addTask(story: StoryModel) {
        var task = {
            text: "",
            story_id: story.story.id,
            state: 0
        };
        service.addTask(task);
    }

    open() {
        this.isOpen(true);
    }

    close() {
        this.isOpen(false);
    }
}


class BoardViewModel {
    stories: KnockoutObservableArray<StoryModel>;

    constructor() {
        var arr : StoryModel[] = [];
        this.stories = ko.observableArray(arr);

        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: StoryModel) => void> this.removeStory.bind(this);
    }

    removeStory(story: StoryModel) {
        service.deleteStory(story.story);
    }

    addStoryDialog(boardModel: BoardViewModel) {
        var story = {
            text: ""
        };
        service.addStory(story);
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
            case 'updated':
                this.stories().forEach(s => {
                    if (s.story.id == story.id) {
                        s.text(story.text);
                    }
                });
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
                        storyModel.tasks().forEach(t => {
                            if (task.id == t.id) {
                                storyModel.tasks.remove(t);
                            }
                        });
                    break;
                    case 'updated':
                        storyModel.tasks().forEach(t => {
                            if (task.id == t.id) {
                                t.text(task.text);
                                t.user(task.user);
                                t.state(task.state);
                            }
                        });
                    break;
                }
            }
        }
    }
}


export class App {

    start() {
        $(document).ready(function() {
            var vm = new BoardViewModel();

            var _dragged;

            ko.bindingHandlers.drag = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    $(element).draggable({
                        cursor: "move",
                        start: function() {
                            _dragged = valueAccessor().value;
                        }
                    });
                }
            }

            ko.bindingHandlers.drop = {
                init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                    $(element).droppable({
                        accept: '.task',
                        drop: function(event, ui) {
                            var task = _dragged;
                            var state = +$(this).attr('state');
                            if (state == task.state()) {
                                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
                            } else {
                                task.state(state);
                                service.updateTask(task);
                                $(ui.draggable).detach().css({top: 0,left: 0});
                            }
                        }
                    });
                }
            }

            ko.bindingHandlers.dialog = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    var options = ko.utils.unwrapObservable(valueAccessor()) || {};
                    options.close = function() {
                        allBindingsAccessor().dialogVisible(false);
                    };
                    $(element).dialog(options);
                    //handle disposal (not strictly necessary in this scenario)
                     ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                         $(element).dialog("destroy");
                     });
                },
                update: function(element, valueAccessor, allBindingsAccessor) {
                     var shouldBeOpen = ko.utils.unwrapObservable(allBindingsAccessor().dialogVisible);
                     $(element).dialog(shouldBeOpen ? "open" : "close");
                }
            };

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
            });
        });
    }
}
