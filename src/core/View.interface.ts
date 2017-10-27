import {Handler} from './HandlerT.interface';
import {ViewConstructor} from './core.type';

export interface View<T> {
    define(viewconstructor:ViewConstructor<T>):View<T>;
    render(model:Map<string, any>):T;
    registerActions(...actionNames:string[]):View<T>;
}