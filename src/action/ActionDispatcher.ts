export class ActionDispatcher {
    private queueAction:Function;
    private lookup:Map<string, Function>;

    constructor(queueAction:Function) {
        this.queueAction = queueAction;
    }
    public dispatch(actionName:string):void {
        this.queueAction(actionName);
    }
}