import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { Receiver } from '../core/Receiver.interface';
import { ApplicationContext } from '../core/ApplicationContext.interface';
import { BaseModel } from '../model/BaseModel';
import { VNodeView } from '../view/VNodeView';
import { BaseReceiver } from '../action/BaseReceiver';
import { ActionDispatcher } from '../action/ActionDispatcher'
import { ActionQueue } from '../action/ActionQueue';
import { VNodeRenderer as Renderer } from '../render/VNodeRenderer';
import { DisplayProviderNode } from '../core/core.type'

export class VNodeApp implements ApplicationContext<DisplayProviderNode> {
    private models:Map<string, Model>;
    private views:Map<string, VNodeView>;
    private recv:Map<string, Receiver>;
    private htmlProvider:Function;
    private viewInjector:Function;
    private actionDispatcher:ActionDispatcher;
    private actionQueue:ActionQueue;
    private renderer:Renderer;

    constructor() {
        this.renderer = new Renderer();
        this.actionQueue = new ActionQueue();
        this.actionDispatcher = new ActionDispatcher(this.actionQueue.queue)
        this.htmlProvider = this.renderer.getViewableProvider();
        this.viewInjector = this.renderer.getViewInjector(this.views);
    }

    public vm(name:string):Receiver {
        let r = new BaseReceiver(name, this.models, this.views);
        this.recv.set(name, r);
        return r;
    }

    public model(name:string):Model {
        let m:Model = new BaseModel(name);
        this.models.set(name, m)
        return m;
    }

    public view(name:string):View<DisplayProviderNode> {
        let v = new VNodeView(name,
            this.htmlProvider,
            this.viewInjector,
            this.actionDispatcher);
        this.views.set(name, v);
        return v;
    }

    public tick():void {
        this.actionTick();
    }

    public init(domNode):void {
        this.renderer.mount(domNode, this.getAppRenderTree);
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

    private getAppRenderTree() {
        let receivers = Array.from(this.recv.values());
        return this.renderer.stitch(() => {
            return receivers.map((r:Receiver) => {
                return r.getRenderTree();
            });
        })
    }
}