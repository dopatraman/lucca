import { Model } from '../core/Model.interface';
import {ModelData} from '../core/core.type';
import {Handler} from '../core/HandlerT.interface';

export class BaseModel implements Model {
    private name:string;
    private data:ModelData;
    private handlers:Map<string, Handler<void>>;
    private upForRender:boolean;
    private queueRender:Function;

    constructor(name:string, queueRender:Function) {
        this.name = name;
        this.queueRender = queueRender;
    }

    public define(data:ModelData):Model {
        this.data = data;
        return this;
    }

    public handle(stateName:string, handler:Handler<void>) {
        this.handlers.set(stateName, handler);
        return this;
    }

    public save():()=> false {
        return (() => false);
    }

    public refresh():void {
        this.upForRender = true;
        this.queueRender();
    }

    public shouldRender():boolean {
        return this.upForRender;
    }

    public handleAction(actionName:string) {
        let handler = this.handlers.get(actionName);
        if (handler) {
            handler.apply(null, this);
        }
    }
}