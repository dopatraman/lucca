import { Model } from './Model.interface';
import { View } from './View.interface';
import { Handler } from './HandlerT.interface';
import { Action, DisplayProviderNode } from '../core/core.type'

export interface Receiver {
    model(name:string):Receiver;
    view(name:string):Receiver;
    accept(actions:Map<string, string>):Receiver;
    contains(...dependencies:string[]):Receiver;
    triggerStageChange(action:Action):void;
    getRenderTree():DisplayProviderNode;
}