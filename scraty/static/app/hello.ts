/// <reference path="jquery.d.ts" />

class BackendService {

    public _host: string = "http://localhost:8080";

    constructor() { }

    public getAllTasks() {
        return $.get( "api/tasks");
    }
}


$(document).ready(function(){
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
});