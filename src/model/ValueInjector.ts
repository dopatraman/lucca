import { ModelData } from '../core/core.type';
import { Injector } from '../core/Injector.interface';

export class ValueInjector implements Injector<any> {
    private data:ModelData;
    constructor(modelData:ModelData) {
        this.data = modelData;
    }
    public inject(modelKey:string):any {
        return this.data.get(modelKey);
    }
}