import { Model } from './Model.interface';
import { View } from './View.interface';
import {Handler} from './HandlerT.interface';

export interface Receiver {
    model(name:string):Receiver;
    view(name:string):Receiver;
    accept(actions:Map<string, string>):Receiver;
    contains(...dependencies:string[]):Receiver;
    doesAcceptAction(actionName:string):boolean;
    shouldRender():boolean;
}