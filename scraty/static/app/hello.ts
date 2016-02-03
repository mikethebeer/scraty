/// <reference path="jquery/jquery.d.ts" />
/// <reference path="jquery/jqueryui.d.ts"/>
/// <reference path="jquery/jquery.colorpicker.d.ts"/>
import {DataService} from "./data_service";
import Story from "./models/Story";
import User from "./models/User";
import Task from "./models/Task";
import BoardViewModel from "./viewmodels/BoardViewModel";
import ko = require("knockout");

export class App {

    start() {
        $(document).ready(function() {
            var vm = new BoardViewModel();
            var _dragged;
            console.info("scraty app started");
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
                        accept: ".task",
                        drop: function(event, ui) {
                            var taskModel = _dragged;
                            var state = +$(this).attr("state");
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

            ko.bindingHandlers.hover = {
                init: function(element, valueAccessor, allBindingsAccessor) {
                    $(element).hover(
                        function() {
                            $( this ).find(".actions").show();
                    }, function() {
                        $( this ).find(".actions").hide();
                    });
                }
            };

            ko.applyBindings(vm);

            var ws = new WebSocket("ws://" + window.location.host + "/websocket");
            ws.onmessage = function (evt) {
                var data = JSON.parse(evt.data);
                console.log(data);
                if (data.object_type == "story") {
                    vm.updateStory(data.action, data.object);
                } else {
                    vm.updateTask(data.action, data.object);
                }
            };

            DataService.getAllStories().done(result => {
                vm.addStories(result.stories);
                $( ".actions" ).hide();
            });

            DataService.getAllUsers().done(result => {
                vm.addUsers(result.users);

            });

            var user_dialog = $( "#user-dialog" ).dialog({
                  autoOpen: false,
                  height: 300,
                  width: 350,
                  modal: true,
                  buttons: {
                    Cancel: function() {
                      user_dialog.dialog( "close" );
                    }
                  }
                });

            $( "#btn-users" ).button().on( "click", function() {
                user_dialog.dialog( "open" );
                $(".color-picker").colorpicker();
            });
        });
    }
}
