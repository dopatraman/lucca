import { h, VNode } from 'maquette';
import { Provider } from '../core/ProviderT.interface';

export class VNodeProvider implements Provider<VNode> {
    constructor() {}

    public provide(selector:string, attr:Map<string, any>, contents:VNode[]): VNode {
        return h(selector, attr, contents);
    }
    public tml = this.provide;
    public forEach(data:any[], iteratorFn: () => VNode): VNode[] {
        if (Array.isArray(data)) {
            return data.map(iteratorFn);
        }
        throw new Error("data must be iterable to use forEach");
    }
}