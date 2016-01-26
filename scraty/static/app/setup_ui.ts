export class SetupUI {

    public init () : void {
        $(document).ready(function() {
            $( "task" ).draggable();
            $( "state" ).droppable();
        });
    }
}