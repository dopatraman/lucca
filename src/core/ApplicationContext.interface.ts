import { Model } from './Model.interface';
import { View } from './View.interface';
import { Receiver } from './Receiver.interface';
import { DisplayNode } from '../core/core.type';

export interface ApplicationContext<T, A> {
    vm(name:string):Receiver;
    model(name:string):Model;
    view(name:string):View<T>;
    tick():void;
    init(root:A):void;
}