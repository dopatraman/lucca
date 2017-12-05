import {Handler} from './HandlerT.interface';

export interface Model {
    define(rawData:Map<string, any>):Model;
    getData():Map<string, any>;
    get(url:string):Model;
    save():() => boolean;
    handle(stateName:string, handler:Handler<void>):Model;
    refresh():void;
    handleStateChange(stateName:string, evt?:Event):void;
}