export interface Renderer<T> {
    stitch(renderFn:() => T[]):T;
    mount(root:any, renderFn:() => T):void;
    getViewableProvider():(...stuff) => T;
    getViewInjector(lookup):(...stuff) => T;
}