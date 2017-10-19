export interface Queue<T> {
    queue(member:T):number;
    dequeue():T;
    peek():T;
}