import { View } from '../core/View.interface';
import { Handler } from '../core/HandlerT.interface';
import { Injector } from '../core/Injector.interface';
import { ModelData, HTMLNode, ViewConstructor } from '../core/core.type';
import { ValueInjector } from '../model/ValueInjector';
import { HTMLNodeInjector } from './HTMLNodeInjector';
import { HTMLViewInjector } from './HTMLViewInjector';
import { ActionDispatcher } from '../action/ActionDispatcher'

export class HTMLView implements View<HTMLNode> {
    private name:string;
    private viewConstructor:Handler<HTMLNode>;
    private htmlInjector:HTMLNodeInjector;
    private viewInjector:HTMLViewInjector;
    private actionLookup:Map<string, Function>;
    private actionDispatcher:ActionDispatcher;
    constructor(name:string, h:HTMLNodeInjector, v:HTMLViewInjector, a:ActionDispatcher) {
        this.name = name;
        this.htmlInjector = h;
        this.viewInjector = v;
        this.actionDispatcher = a;
        this.actionLookup = new Map<string, Function>();
    }

    public define(viewConstructor:ViewConstructor<HTMLNode>):View<HTMLNode> {
        this.viewConstructor = viewConstructor;
        return this;
    }

    public render(data:ModelData):HTMLNode {
        let valueInjector = new ValueInjector(data);
        return this.viewConstructor(this.htmlInjector.inject, this.viewInjector.inject, valueInjector.inject, this.actionLookup);
    }

    public registerActions(...actionNames:string[]):View<HTMLNode> {
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