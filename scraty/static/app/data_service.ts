import {Task} from './task';
import {Story} from './story';

export class DataService {

    public getAllTasks() : JQueryPromise<any> {
        var tasks: Task[];

        return $.get( "api/tasks").done(result => {
            return result['tasks'];
        }).fail(function() {
            return tasks;
        });
    }

    public getAllStories() : JQueryPromise<any> {
        var stories: Story[];

        return $.get( "api/stories").done(result => {
            return result['stories'];
        }).fail(function() {
            return stories;
        });
    }

    public addStory(story:Story) : JQueryPromise<any> {
        return $.post( "api/stories", JSON.stringify(story));
    }

    public updateStory(story:Story) : JQueryPromise<any> {
        return $.post( "api/stories/" + story.id, JSON.stringify(story));
    }

    public deleteStory(story:Story) : JQueryPromise<any> {
        return $.ajax({
            url: "api/stories/" + story.id,
            type: "DELETE",
            success: function (response) {
                return response;
            }
        });
    }

    public addTask(task:Task) : JQueryPromise<any> {
        return $.post( "api/tasks", JSON.stringify(task));
    }

    public updateTask(task:Task) : JQueryPromise<any> {
        return $.post( "api/tasks/" + task.id, JSON.stringify(task));
    }

    public deleteTask(task:Task) : JQueryPromise<any> {
        return $.ajax({
            url: "api/tasks/" + task.id,
            type: "DELETE",
            success: function (response) {
                return response;
            }
        });
    }
}