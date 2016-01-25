/// <reference path="jquery.d.ts" />

export class BackendService {

    public _host: string = "http://localhost:8080";

    constructor() { }

    public getAllTasks() {
        var jqxhr = $.get( this._host + "/api/tasks", function() {
            alert( "success" );
        }).fail(function() {
            alert( "error" );
        })
    }
}