import { Handler } from './HandlerT.interface';
import { ViewConstructor } from './core.type';
import { Model } from './Model.interface';

export interface View<T> {
    define(viewconstructor:ViewConstructor<T>):View<T>;
    render(model:Model):T;
    registerActions(...actionNames:string[]):View<T>;
}