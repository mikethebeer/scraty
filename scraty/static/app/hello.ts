/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
import {DataService} from './data_service';
import {Story} from './story';
import ko = require('knockout');


class BoardViewModel {
    public stories: KnockoutObservableArray<Story>;
    constructor(stories: Story[]) {
        this.stories = ko.observableArray(stories);
    }
}


export class App {
    start() {
        $(document).ready(function(){
            var service = new DataService();
            var ws = new WebSocket("ws://localhost:8080/websocket");
            ws.onopen = function() {
                ws.send("Hello, world");
            };
            ws.onmessage = function (evt) {
                alert(evt.data);
            };

            service.getAllStories().done(result => {
                ko.applyBindings(new BoardViewModel(result.stories));
            });
        });
    }
}
