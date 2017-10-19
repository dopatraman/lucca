export interface Injector<T> {
    inject(...args:any[]):T;
}