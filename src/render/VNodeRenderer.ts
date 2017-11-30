import { Renderer } from '../core/Renderer.interface';
import { h, createProjector, VNode, Projector } from 'maquette';
import { DisplayNode } from '../core/core.type';
import { VNodeProvider } from './VNodeProvider';

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

    public getViewableProvider():VNodeProvider {
        return new VNodeProvider();
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