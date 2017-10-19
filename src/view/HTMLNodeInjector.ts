import { Injector } from '../core/Injector.interface';
import { Handler } from '../core/HandlerT.interface'
import { VNode, h } from 'maquette';
import { ActionDispatcher } from '../action/ActionDispatcher';

export class HTMLNodeInjector implements Injector<VNode> {
    private actionDispatcher:ActionDispatcher;
    constructor(actionDispatcher:ActionDispatcher) {
        this.actionDispatcher = actionDispatcher;
    }
    public inject(selector:string, actions:Map<string, string>, attr:Map<string, any>, content:(string | VNode)[]):VNode {
        let combinedAttr = { ...attr, ...actions}
        return h(selector, combinedAttr, content);
    }
}