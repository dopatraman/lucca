import {ModelData} from './core.type';
import {Handler} from './HandlerT.interface';

export interface Model {
    define(rawData:ModelData):Model;
    save():() => boolean;
    handle(stateName:string, handler:Handler<void>):Model;
    refresh():void;
    shouldRender():boolean;
    handleAction(actionName:string):void;
}