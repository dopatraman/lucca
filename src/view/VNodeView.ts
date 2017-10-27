import { View } from '../core/View.interface';
import { DisplayProviderNode } from '../core/core.type'
import { Handler } from '../core/HandlerT.interface';
import { Injector } from '../core/Injector.interface';
import { ModelData, ViewConstructor } from '../core/core.type';
import { ValueInjector } from '../model/ValueInjector';
import { ActionDispatcher } from '../action/ActionDispatcher'

export class VNodeView implements View<DisplayProviderNode> {
    private name:string;
    private viewConstructor:Handler<DisplayProviderNode>;
    private htmlProvider:Function;
    private viewProvider:Function;
    private actionLookup:Map<string, Function>;
    private actionDispatcher:ActionDispatcher;
    constructor(name:string, h:Function, v:Function, a:ActionDispatcher) {
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

    public render(data:ModelData):DisplayProviderNode {
        let valueInjector = new ValueInjector(data);
        return this.viewConstructor(this.htmlProvider, this.viewProvider, valueInjector.inject.bind(valueInjector), this.actionLookup);
    }

    public registerActions(...actionNames:string[]):View<DisplayProviderNode> {
        for (var i = 0; i < actionNames.length; i++) {
            let actionName = actionNames[i];
            this.actionLookup.set(
                actionName,
                this.actionDispatcher.dispatch.bind(
                    this.actionDispatcher, 
                    actionName
                )
            );
        }
        return this;
    }
}