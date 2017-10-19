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
    constructor(name:string, h:HTMLNodeInjector, v:HTMLViewInjector) {
        this.name = name;
        this.htmlInjector = h;
        this.viewInjector = v;
    }

    public define(viewConstructor:ViewConstructor<HTMLNode>):View<HTMLNode> {
        this.viewConstructor = viewConstructor;
        return this;
    }

    public render(data:ModelData):HTMLNode {
        let valueInjector = new ValueInjector(data);
        return this.viewConstructor(this.htmlInjector.inject, this.viewInjector.inject, valueInjector.inject);
    }
}