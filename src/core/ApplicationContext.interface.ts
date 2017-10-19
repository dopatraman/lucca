import { Model } from './Model.interface';
import { View } from './View.interface';
import { Receiver } from './Receiver.interface';

export interface ApplicationContext<T> {
    vm(name:string):Receiver;
    model(name:string):Model;
    view(name:string):View<T>;
    tick():void;
    init():void;
    up():void;
}