import {Task, Story} from './models';

export module DataService {

    export function getAllTasks() : JQueryPromise<any> {
        var tasks: Task[];

        return $.get( "api/tasks").done(result => {
            return result['tasks'];
        }).fail(function() {
            return tasks;
        });
    }

    export function getAllStories() : JQueryPromise<any> {
        var stories: Story[];

        return $.get( "api/stories").done(result => {
            return result['stories'];
        }).fail(function() {
            return stories;
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
        return $.post( "api/tasks", JSON.stringify(task));
    }

    export function updateTask(task:Task) : JQueryPromise<any> {
        return $.post( "api/tasks/" + task.id, JSON.stringify(task));
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