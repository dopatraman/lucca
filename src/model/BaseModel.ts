import { Model } from '../core/Model.interface';
import {ModelData} from '../core/core.type';
import {Handler} from '../core/HandlerT.interface';

export class BaseModel implements Model {
    private name:string;
    private data:ModelData;
    private handlers:Map<string, Handler<void>>;
    private queueRender:Function;

    constructor(name:string, queueRender:Function) {
        this.name = name;
        this.queueRender = queueRender;
    }

    public define(data:ModelData):Model {
        this.data = data;
        return this;
    }

    public getData():ModelData {
        return this.data;
    }

    public handle(stateName:string, handler:Handler<void>) {
        this.handlers.set(stateName, handler);
        return this;
    }

    public save():()=> false {
        return (() => false);
    }

    public refresh():void {
        this.queueRender();
    }

    public handleStateChange(stateName:string):void {
        let handler = this.handlers.get(stateName);
        if (handler) {
            handler.apply(this, this.data);
            this.refresh();
            return;
        }
        console.error(`state ${stateName} not handled`);
    }
}