import { Model } from '../core/Model.interface';
import {Handler} from '../core/HandlerT.interface';

export class BaseModel implements Model {
    private name:string;
    private data:Map<string, any>;
    private handlers:Map<string, Handler<void>>;

    constructor(name:string) {
        this.name = name;
        this.data = new Map<string, any>();
        this.handlers = new Map<string, Handler<void>>();
    }

    public define(data:any):Model {
        Object.keys(data).forEach(key => {
            this.data.set(key, data[key]);
        });
        return this;
    }

    public getData():Map<string, any> {
        return this.data;
    }

    public handle(stateName:string, handler:Handler<void>) {
        this.handlers.set(stateName, handler);
        return this;
    }

    public save():()=> false {
        return (() => false);
    }

    public refresh():void {}

    public handleStateChange(stateName:string):void {
        let handler = this.handlers.get(stateName);
        if (handler) {
            handler.apply(this, [this.data]);
            return;
        }
        console.error(`state ${stateName} not handled`);
    }
}