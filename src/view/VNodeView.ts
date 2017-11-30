import { View } from '../core/View.interface';
import { Model } from '../core/Model.interface';
import { DisplayProviderNode } from '../core/core.type'
import { Handler } from '../core/HandlerT.interface';
import { Injector } from '../core/Injector.interface';
import { ViewConstructor } from '../core/core.type';
import { ValueInjector } from '../model/ValueInjector';
import { ActionDispatcher } from '../action/ActionDispatcher'
import { VNodeProvider } from '../render/VNodeProvider';

export class VNodeView implements View<DisplayProviderNode> {
    private name:string;
    private viewConstructor:Handler<DisplayProviderNode>;
    private htmlProvider:VNodeProvider;
    private viewProvider:Function;
    private actionLookup:any;
    private actionDispatcher:ActionDispatcher;

    constructor(name:string, h:VNodeProvider, v:Function, a:ActionDispatcher) {
        this.name = name;
        this.htmlProvider = h;
        this.viewProvider = v;
        this.actionDispatcher = a;
        this.actionLookup = new Map<string, Function>();
    }

    public define(viewConstructor:ViewConstructor<DisplayProviderNode>):View<DisplayProviderNode> {
        this.viewConstructor = viewConstructor;
        return this;
    }

    public render(model:Model):DisplayProviderNode {
        return this.viewConstructor(this.htmlProvider, this.viewProvider, model.getData(), this.actionLookup);
    }

    public registerActions(...actionNames:string[]):View<DisplayProviderNode> {
        for (var i = 0; i < actionNames.length; i++) {
            let actionName = actionNames[i];
            this.actionLookup[actionName] = this.actionDispatcher.dispatch.bind(
                this.actionDispatcher, 
                actionName
            );
        }
        return this;
    }
}
