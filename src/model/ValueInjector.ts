import { Injector } from '../core/Injector.interface';

export class ValueInjector implements Injector<any> {
    private data:any;
    constructor(modelData:any) {
        this.data = modelData;
    }
    public inject(modelKey:string):any {
        return this.data[modelKey];
    }
}