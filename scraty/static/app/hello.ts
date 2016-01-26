/// <reference path="jquery.d.ts" />
import {BackendService} from './backend_service'


export class App {
    start() {
        var service = new BackendService();
        var ws = new WebSocket("ws://localhost:8080/websocket");
        ws.onopen = function() {
            ws.send("Hello, world");
        };
        ws.onmessage = function (evt) {
            alert(evt.data);
        };

        service.getAllTasks().done(function(result){
            $("#status").text(JSON.stringify(result));
        }).fail(function(){

        }).always(function(){

        });
    }
}
