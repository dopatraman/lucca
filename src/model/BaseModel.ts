import { Model } from '../core/Model.interface';
import { Handler } from '../core/HandlerT.interface';
import { HttpService } from '../net/HttpService';

export class BaseModel implements Model {
    private name:string;
    private data:any;
    private handlers:Map<string, Handler<void>>;
    private http:HttpService;
    private isLoading:boolean;

    constructor(name:string) {
        this.name = name;
        this.data = {};
        this.handlers = new Map<string, Handler<void>>();
        this.http = new HttpService();
        this.isLoading = false;
    }

    public define(data:any):Model {
        this.data = data;
        return this;
    }

    public get(url:string):Model {
        this.isLoading = true;
        this.http.get(url, (res:any) => {
            this.data = res;
            this.isLoading = false;
        });
        return this;
    }

    public getData():any {
        return this.data;
    }

    public handle(stateName:string, handler:Handler<void>) {
        this.handlers.set(stateName, handler);
        return this;
    }

    public save():()=> boolean {
        return (() => false);
    }

    public refresh():void {}

    public handleStateChange(stateName:string, evt?:Event):void {
        let handler = this.handlers.get(stateName);
        if (handler) {
            handler.apply(this, [this.data, evt]);
            return;
        }
        console.error(`state ${stateName} not handled`);
    }
}