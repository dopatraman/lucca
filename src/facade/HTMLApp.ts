import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { Receiver } from '../core/Receiver.interface';
import { ApplicationContext } from '../core/ApplicationContext.interface';
import { BaseModel } from '../model/BaseModel';
import { HTMLView } from '../view/HTMLView';
import { HTMLNodeInjector } from '../view/HTMLNodeInjector';
import { HTMLViewInjector } from '../view/HTMLViewInjector';
import { BaseReceiver } from '../action/BaseReceiver';
import { ActionDispatcher } from '../action/ActionDispatcher'
import { ActionQueue } from '../action/ActionQueue';
import { HTMLNode } from '../core/core.type';
import { RenderQueue } from '../render/RenderQueue';

export class HTMLApp implements ApplicationContext<HTMLNode> {
    private models:Map<string, Model>;
    private views:Map<string, HTMLView>;
    private recv:Map<string, Receiver>;
    private htmlInjector:HTMLNodeInjector;
    private viewInjector:HTMLViewInjector;
    private actionDispatcher:ActionDispatcher;
    private actionQueue:ActionQueue;
    private renderQueue:RenderQueue;

    constructor() {
        this.actionQueue = new ActionQueue();
        this.renderQueue = new RenderQueue();
        this.actionDispatcher = new ActionDispatcher(this.actionQueue.queue)
        this.htmlInjector = new HTMLNodeInjector();
        this.viewInjector = new HTMLViewInjector(this.views);
    }

    public vm(name:string):Receiver {
        let r = new BaseReceiver(name, this.models, this.views);
        this.recv.set(name, r);
        return r;
    }

    public model(name:string):Model {
        let m:Model = new BaseModel(name, this.renderQueue.queue);
        this.models.set(name, m)
        return m;
    }

    public view(name:string):HTMLView {
        let v = new HTMLView(name,
            this.htmlInjector,
            this.viewInjector,
            this.actionDispatcher);
        this.views.set(name, v);
        return v;
    }

    public tick():void {
        this.actionTick();
    }

    public init():void {

    }

    public up():void {
        
    }

    private actionTick() {
        let nextAction = this.actionQueue.dequeue();
        if (nextAction) {
            this.recv.forEach((r:Receiver) => {
                r.triggerStageChange(nextAction);
            });
        }
    }
}