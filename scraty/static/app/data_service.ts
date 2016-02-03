import Task from "./models/Task";
import User from "./models/User";
import Story from "./models/Story";
import IStory from "./models/Story";

export module DataService {

    export function getAllTasks() : JQueryPromise<any> {
        var tasks: Task[] = [];

        return $.get( "api/tasks").done(result => {
            return result["tasks"];
        }).fail(function() {
            return tasks;
        });
    }

    export function getAllStories() : JQueryPromise<any> {
        var stories: Story[] = [];

        return $.get( "api/stories").done(result => {
            return result["stories"];
        }).fail(function() {
            return stories;
        });
    }

    export function getAllUsers() : JQueryPromise<any> {
        var users: User[] = [];

        return $.get( "api/users").done(result => {
            return result;
        }).fail(function() {
            return users;
        });
    }

    export function addStory(story:Story) : JQueryPromise<any> {
        return $.post( "api/stories", JSON.stringify(story));
    }

    export function updateStory(story:Story) : JQueryPromise<any> {
        return $.post( "api/stories/" + story.id, JSON.stringify(story));
    }

    export function deleteStory(story:Story) : JQueryPromise<any> {
        return $.ajax({
            url: "api/stories/" + story.id,
            type: "DELETE",
            success: function (response) {
                return response;
            }
        });
    }

    export function addTask(task:Task) : JQueryPromise<any> {
        return $.post( "api/tasks", JSON.stringify(task, function(k, v) {
            if (k=== "user") {
                return v.name;
            } else {
                return v;
            }
        }));
    }

    export function updateTask(task:Task) : JQueryPromise<any> {
        return $.post( "api/tasks/" + task.id, JSON.stringify(task, function(k, v) {
            if (k=== "user") {
                return v.name;
            } else {
                return v;
            }
        }));
    }

    export function updateUser(user:User) : JQueryPromise<any> {
        return $.post( "api/users/" + user.name, JSON.stringify(user));
    }

    export function deleteUser(user:User) : JQueryPromise<any> {
        return $.ajax({
            url: "api/users/" + user.name,
            type: "DELETE",
            success: function (response) {
                return response;
            }
        });
    }

    export function deleteTask(task:Task) : JQueryPromise<any> {
        return $.ajax({
            url: "api/tasks/" + task.id,
            type: "DELETE",
            success: function (response) {
                return response;
            }
        });
    }
}
