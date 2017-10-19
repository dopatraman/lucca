import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { Receiver } from '../core/Receiver.interface';
import { ApplicationContext } from '../core/ApplicationContext.interface';
import { BaseReceiver } from '../receiver/BaseReceiver';
import { BaseModel } from '../model/BaseModel';
import { HTMLView } from '../view/HTMLView';
import { HTMLNodeInjector } from '../view/HTMLNodeInjector';
import { HTMLViewInjector } from '../view/HTMLViewInjector';
import { ActionDispatcher } from '../action/ActionDispatcher'
import { HTMLNode } from '../core/core.type';

export class HTMLApp implements ApplicationContext<HTMLNode> {
    private models:Map<string, Model>;
    private views:Map<string, HTMLView>;
    private recv:Map<string, Receiver>;
    private htmlInjector:HTMLNodeInjector;
    private viewInjector:HTMLViewInjector;
    private actionDispatcher:ActionDispatcher;

    constructor() {
        this.actionDispatcher = new ActionDispatcher(() => {})
        this.htmlInjector = new HTMLNodeInjector(this.actionDispatcher);
        this.viewInjector = new HTMLViewInjector(this.views);
    }

    public vm(name:string):Receiver {
        let r = new BaseReceiver(name, this.models, this.views);
        this.recv.set(name, r);
        return r;
    }

    public model(name:string):Model {
        let m = new BaseModel(name, () => {});
        this.models.set(name, m)
        return m;
    }

    public view(name:string):HTMLView {
        let v = new HTMLView(name,
            this.htmlInjector,
            this.viewInjector);
        this.views.set(name, v);
        return v;
    }

    public tick():void {

    }

    public init():void {

    }

    public up():void {
        
    }
}