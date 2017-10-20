import {ModelData} from './core.type';
import {Handler} from './HandlerT.interface';

export interface Model {
    define(rawData:ModelData):Model;
    getData():ModelData;
    save():() => boolean;
    handle(stateName:string, handler:Handler<void>):Model;
    refresh():void;
    handleStateChange(stateName:string):void;
}