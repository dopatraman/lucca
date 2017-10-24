import { View } from './View.interface';
export interface Renderer<T> {
    stitch(renderFn:() => T[]):T;
    mount(root:any, renderFn:() => T):void;
    getViewableProvider():(...stuff:any[]) => T;
    getViewInjector(lookup:Map<string, View<T>>):(...stuff:any[]) => T;
}