import { Injector } from '../core/Injector.interface';

export class ValueInjector implements Injector<any> {
    private data:Map<string, any>;
    constructor(modelData:Map<string, any>) {
        this.data = modelData;
    }
    public inject(modelKey:string):any {
        return this.data.get(modelKey);
    }
}