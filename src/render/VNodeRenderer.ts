import { Renderer } from '../core/Renderer.interface';
import { h, createProjector, VNode, Projector } from 'maquette';
import { DisplayNode } from '../core/core.type';
export class VNodeRenderer implements Renderer<VNode> {
    private projector:Projector;
    constructor() {
        this.projector = createProjector();
    }

    public stitch(renderChildren:() => VNode[]):VNode {
        return h('div.appContainer', {}, renderChildren());
    }

    public mount(domNode:DisplayNode, renderFn:() => VNode):void {
        this.projector.append(domNode, renderFn);
    }

    public getViewableProvider():(a:string,b:Map<string, any>,c:VNode[]) => VNode {
        return (selector, attr, contents) => {
            return h(selector, attr, contents);
        }
    }

    public getViewInjector(lookup:Map<any, any>):(name:string, data:Map<any, any>) => VNode {
        return (name, data) => {
            let view = lookup.get(name);
            if (view) {
                return view.render(data);
            }
        }
    }
}