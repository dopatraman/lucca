export interface Provider<T> {
    provide(...params:any[]):T;
}