import { Model } from './Model.interface';
import { View } from './View.interface';
import {Handler} from './HandlerT.interface';
import { HTMLNode } from './core.type';

export interface Receiver {
    model(name:string):Receiver;
    view(name:string):Receiver;
    accept(actions:Map<string, string>):Receiver;
    contains(...dependencies:string[]):Receiver;
    triggerStageChange(actionName:string):void;
    getRenderTree():HTMLNode;
}