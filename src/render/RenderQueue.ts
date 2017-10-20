import { Queue } from '../core/QueueT.interface';

export class RenderQueue implements Queue<string> {
    private members:string[];

    constructor() {}

    public queue(member?:string) {
        if (!member) { member = 'render!'; }
        this.members.push(member);
        return this.members.length;
    }

    public dequeue():string {
        if (this.members.length > 0) {
            return this.members.shift();
        }
        console.info('Render Queue is empty');
    }

    public peek():string {
        return this.members[0];
    }
}