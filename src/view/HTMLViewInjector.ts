import { HTMLNode } from '../core/core.type';
import { HTMLView } from './HTMLView';
import { Injector } from '../core/Injector.interface';

export class HTMLViewInjector implements Injector<HTMLNode> {
    private lookup:Map<string, HTMLView>;
    constructor(lookup:Map<string, HTMLView>) {
        this.lookup = lookup;
    }
    public inject(viewName:string, data:Map<string, any>):HTMLNode {
        return this.lookup.get(viewName).render(data);
    }
}