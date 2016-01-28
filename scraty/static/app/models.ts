import{DataService} from './data_service';
import ko = require('knockout');
import markdown = require('markdown');

export interface Story {
    id?: string;
    link?: string;
    position?: number;
    text?: string;
    tasks?: Task[];
}

export interface Task {
    id?: string;
    story_id?: string;
    text?: string;
    user?: string;
    state?: number;
}

export class TaskModel {

    id: string;
    story_id: KnockoutObservable<string>;
    text: KnockoutObservable<string>;
    user: KnockoutObservable<string>;
    state: KnockoutObservable<number>;
    isOpen: KnockoutObservable<boolean>;
    markdownText: KnockoutComputed<string>;

    constructor(task: Task) {
        this.id = task.id;
        this.story_id = ko.observable(task.story_id);
        this.text = ko.observable(task.text);
        this.user = ko.observable(task.user);
        this.state = ko.observable(task.state);
        this.isOpen = ko.observable(task.text == "");
        this.markdownText = ko.computed(function() {
            return markdown.toHTML(this.text());
        }, this);
    }

    open() {
        this.isOpen(true);
    }

    close() {
        this.isOpen(false);
    }

    saveTask(taskModel: TaskModel) {
        DataService.updateTask(taskModel.asTask());
        this.close();
    }

    removeTask(task: Task) {
        // removal from DOM is done via websocket delete event
        DataService.deleteTask(task);
    }

    asTask(): Task {
        return this.toTask(this);
    }

    private toTask (taskModel: TaskModel) : Task {
        return {
            id: taskModel.id,
            text: taskModel.text(),
            user: taskModel.user(),
            state: taskModel.state(),
            story_id: taskModel.story_id()
        };
    }
}


export class StoryModel {

    tasks: KnockoutObservableArray<TaskModel>;
    todoTasks: KnockoutObservableArray<TaskModel>;
    inProgressTasks: KnockoutObservableArray<TaskModel>;
    verifyTasks: KnockoutObservableArray<TaskModel>;
    doneTasks: KnockoutObservableArray<TaskModel>;
    text: KnockoutObservable<string>;
    isOpen: KnockoutObservable<boolean>;
    markdownText: KnockoutComputed<string>;

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
        this.markdownText = ko.computed(function() {
            return markdown.toHTML(this.text());
        }, this);
    }

    addTask(storyModel: StoryModel) {
        var task = {
            text: "",
            story_id: storyModel.story.id,
            state: 0
        };
        DataService.addTask(task);
    }

    saveStory(storyModel: StoryModel) {
        var story = {
            id: storyModel.story.id,
            text: storyModel.text(),
        };
        DataService.updateStory(story);
        this.close();
    }

    open() {
        this.isOpen(true);
    }

    close() {
        this.isOpen(false);
    }
}


export class BoardViewModel {
    stories: KnockoutObservableArray<StoryModel>;

    constructor() {
        var arr : StoryModel[] = [];
        this.stories = ko.observableArray(arr);

        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: StoryModel) => void> this.removeStory.bind(this);
    }

    removeStory(story: StoryModel) {
        DataService.deleteStory(story.story);
    }

    addStoryDialog(boardModel: BoardViewModel) {
        var story = {
            text: "",
            position: 0
        };
        DataService.addStory(story);
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
