import { View } from './View.interface';
import { Provider } from './ProviderT.interface';

export interface Renderer<T> {
    stitch(renderFn:() => T[]):T;
    mount(root:any, renderFn:() => T):void;
    getViewableProvider():Provider<T>;
    getViewInjector(lookup:Map<string, View<T>>):(...stuff:any[]) => T;
}