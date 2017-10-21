import { Receiver } from '../core/Receiver.interface';
import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { DisplayProviderNode } from '../core/core.type'

export class BaseReceiver implements Receiver {
    private name:string;
    private modelLookup:Map<string, Model>;
    private viewLookup:Map<string, View<DisplayProviderNode>>;
    private _model:Model;
    private _view:View<DisplayProviderNode>;
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

    public triggerStageChange(actionName:string):void {
        if (this.doesAcceptAction(actionName)) {
            this._model.handleStateChange(this.actionStateRoutes.get(actionName));
        }
    }

    public getRenderTree():DisplayProviderNode {
        return this._view.render(this._model.getData());
    }

    private doesAcceptAction(actionName:string):boolean {
        return this.actionStateRoutes.has(actionName);
    }
}