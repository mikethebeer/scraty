/// <reference path="jquery.d.ts" />
import {DataService} from './data_service';

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
                $("#status").text(JSON.stringify(result));
            });
        });
    }
}