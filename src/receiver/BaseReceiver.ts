import { ViewType } from '../core/core.type';
import { Receiver } from '../core/Receiver.interface';
import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { BaseModel } from '../model/BaseModel';
import { HTMLView } from '../view/HTMLView';

export class BaseReceiver implements Receiver {
    private name:string;
    private modelLookup:Map<string, Model>;
    private viewLookup:Map<string, View<ViewType>>;
    private _model:Model;
    private _view:View<ViewType>;
    private actionStateRoutes:Map<string, string>;
    private dependencies: string[];

    constructor(name:string, modelLookup, viewLookup) {
        this.name = name;
        this.modelLookup = modelLookup;
        this.viewLookup = viewLookup;
    }

    public model(name:string):Receiver {
        this._model = this.modelLookup.get(name);
        return this;
    }

    public view(name:string):Receiver {
        this._view = this.viewLookup.get(name);
        return this;
    }

    public accept(routes:Map<string, string>):Receiver {
        this.actionStateRoutes = routes;
        return this;
    }

    public contains(...dependencies:string[]):Receiver {
        this.dependencies = dependencies;
        return this;
    }

    public doesAcceptAction(actionName:string):boolean {
        return this.actionStateRoutes.has(actionName);
    }

    public shouldRender():boolean {
        return this._model.shouldRender();
    }
}