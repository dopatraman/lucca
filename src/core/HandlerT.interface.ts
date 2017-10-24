export interface Handler<T> {
    (...stuff:any[]):T;
}