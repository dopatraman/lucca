import { Queue } from '../core/QueueT.interface';
import { Action } from '../core/core.type';

export class ActionQueue implements Queue<Action> {
    private members:Action[];

    constructor() {}

    public queue(action:Action):number {
        this.members.push(action);
        return this.members.length;
    }

    public dequeue():Action {
        if (this.members.length > 0) {
            return this.members.shift();
        }
        console.info('Action Queue is empty')
    }

    public peek():Action {
        return this.members[0];
    }
}