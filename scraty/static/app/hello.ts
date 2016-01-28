/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="jqueryui.d.ts"/>
import {DataService} from './data_service';
import {Story, Task, BoardViewModel} from './models';
import ko = require('knockout');

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
                            var taskModel = _dragged;
                            var state = +$(this).attr('state');
                            if (state == taskModel.state()) {
                                $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
                            } else {
                                taskModel.state(state);
                                DataService.updateTask(taskModel.asTask());
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

            DataService.getAllStories().done(result => {
                vm.addStories(result.stories);
            });
        });
    }
}
