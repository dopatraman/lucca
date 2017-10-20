import {VNode} from 'maquette';
import {ModelData} from './core.type';
import {Handler} from './HandlerT.interface';
import {ViewConstructor} from './core.type';

export interface View<T> {
    define(viewconstructor:ViewConstructor<T>):View<T>;
    render(model:ModelData):T;
    registerActions(...actionNames:string[]):View<T>;
}