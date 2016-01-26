
export class BackendService {

    public _host: string = "http://localhost:8080";

    constructor() { }

    public getAllTasks() {
        return $.get( "api/tasks");
    }
}
