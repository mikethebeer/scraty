/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="jqueryui.d.ts"/>
import {DataService} from './data_service';
import {Story} from './story';
import {Task} from './task';
import ko = require('knockout');

class BoardViewModel {
    stories: KnockoutObservableArray<Story>;
    private service: DataService;

    constructor(service: DataService) {
        var arr : Story[] = [];
        this.stories = ko.observableArray(arr);
        this.service = service;

        // WTF: http://stackoverflow.com/questions/12767128/typescript-wrong-context-this
        this.removeStory = <(story: Story) => void> this.removeStory.bind(this);
    }

    removeStory(story: Story) {
        this.stories.remove(story);
        this.service.deleteStory(story);
    }

    addStory(story: Story) {
        this.stories.push(story);
    }
}


export class App {

    start() {
        $(document).ready(function() {
            var service = new DataService();
            var vm = new BoardViewModel(service)
            ko.applyBindings(vm);

            var ws = new WebSocket("ws://localhost:8080/websocket");
            ws.onopen = function() {
                ws.send("Hello, world");
            };
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                console.log(data);
                switch (data.action) {
                    case 'added':
                        vm.stories.push(data.object)
                        break;
                    case 'deleted':
                        for (var i = 0; i < vm.stories().length; i++) {
                            var story = vm.stories()[i];
                            if (story.id == data.object.id) {
                                vm.stories.remove(story)
                            }
                        }
                        break;
                }
            };

            service.getAllStories().done(result => {
                vm.stories(result.stories);

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