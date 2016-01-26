/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="jqueryui.d.ts"/>
import {DataService} from './data_service';
import {Story} from './story';
import ko = require('knockout');


class BoardViewModel {
    stories: KnockoutObservableArray<Story>;
    private service: DataService;

    constructor(service: DataService, stories: Story[]) {
        this.stories = ko.observableArray(stories);
        this.service = service;

        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: Story) => void> this.removeStory.bind(this);
    }

    removeStory(story: Story) {
        this.stories.remove(story);
        this.service.deleteStory(story);
    }

    foo() {
        console.log(this.stories.pop());
    }

    addStory(story: Story) {
        this.stories.push(story);
    }
}


export class App {
    start() {
        $(document).ready(function() {
            var service = new DataService();
            var ws = new WebSocket("ws://localhost:8080/websocket");
            ws.onopen = function() {
                ws.send("Hello, world");
            };
            ws.onmessage = function (evt) {
                alert(evt.data);
            };

            service.getAllStories().done(result => {
                ko.applyBindings(new BoardViewModel(service, result.stories));
            });
        });
    }
}
