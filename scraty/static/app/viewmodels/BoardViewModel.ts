import StoryModel from "./StoryModel";
import TaskModel from "./TaskModel";
import UserModel from "./UserModel";
import Story from "../models/Story";
import User from "../models/User";
import Task from "../models/Task";
import {DataService} from "../data_service";
import ko = require("knockout");

export default class BoardViewModel {
    stories: KnockoutObservableArray<StoryModel>;
    tasks: KnockoutObservableArray<TaskModel>;
    users: KnockoutObservableArray<UserModel>;

    constructor() {
        var arrStoryModel: StoryModel[] = [];
        var arrTaskModel: TaskModel[] = [];
        var arrUserModel: UserModel[] = [];

        this.stories = ko.observableArray(arrStoryModel);
        this.tasks = ko.observableArray(arrTaskModel);
        this.users = ko.observableArray(arrUserModel);


        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: StoryModel) => void> this.removeStory.bind(this);
    }

    removeStory(story: StoryModel) {
        DataService.deleteStory(story.asStory());
    }

    addStoryDialog(boardModel: BoardViewModel) {
        this.stories.push(new StoryModel(new Story(null, null, 0, "", [])));
    }

    addStories(stories: Story[]) {
        for (var i = 0, len = stories.length; i < len; i++) {
            this.stories.push(new StoryModel(stories[i]));
        }
    }

    addUsers(users: User[]) {
        if (users) {
            for (var i = 0, len = users.length; i < len; i++) {
                this.users.push(new UserModel(users[i]));
            }
        }
    }

    addStory(story: StoryModel) {
        this.stories.push(story);
    }

    updateStory(action: string, story: Story) {
        switch (action) {
            case "added":
                this.stories.push(new StoryModel(story));
                break;
            case "deleted":
                for (var i = 0; i < this.stories().length; i++) {
                    var storyModel = this.stories()[i];
                    if (story.id === storyModel.asStory().id) {
                        this.stories.remove(storyModel);
                    }
                }
                break;
            case "updated":
                this.stories().forEach(s => {
                    if (s.asStory().id === story.id) {
                        s.text(story.text);
                    }
                });
                break;
        }
    }

    updateTask(action: string, taskModel: TaskModel) {
        var story_id = taskModel.story_id();
        for (var i = 0, len = this.stories().length; i < len; i++) {
            var storyModel = this.stories()[i];
            if (storyModel.id === story_id) {
                switch (action) {
                    case "added":
                        storyModel.tasks.push(taskModel);
                    break;
                    case "deleted":
                        storyModel.tasks().forEach(t => {
                            if (taskModel.id === t.id) {
                                storyModel.tasks.remove(t);
                            }
                        });
                    break;
                    case "updated":
                        storyModel.tasks().forEach(t => {
                            if (taskModel.id === t.id) {
                                t.text(taskModel.text());
                                t.state(taskModel.state());
                                t.user(taskModel.user());
                            }
                        });
                    break;
                }
            }
        }
    }
}
