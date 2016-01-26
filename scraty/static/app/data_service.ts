import {Task} from './task';
import {Story} from './story';

export class DataService {

    public getAllTasks() : Task[] {
        var tasks: Task[];

        $.get( "api/tasks").done(result => {
            return result['tasks'];
        }).fail(function() {
            return tasks;
        });

        return tasks;
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
}