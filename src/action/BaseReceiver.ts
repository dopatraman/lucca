import { Receiver } from '../core/Receiver.interface';
import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { Action, DisplayProviderNode } from '../core/core.type'

export class BaseReceiver implements Receiver {
    private name:string;
    private _modelName:string;
    private _viewName:string;
    private _model:Model;
    private _view:View<DisplayProviderNode>;
    private actionStateRoutes:any;
    private dependencies: string[];

    constructor(name:string) {
        this.name = name;
    }

    public init(modelLookup: Map<string, Model>, viewLookup:Map<string, View<DisplayProviderNode>>):void {
        let m:Model = modelLookup.get(this._modelName);
        let v:View<DisplayProviderNode> = viewLookup.get(this._viewName);
        if (m == null) {
            throw new Error(`model ${this._modelName} is null`)
        }
        if (v == null) {
            throw new Error(`view ${this._viewName} is null`)
        }
        this._model = m;
        this._view = v;
    }

    public model(name:string):Receiver {
        this._modelName = name;
        return this;
    }

    public view(name:string):Receiver {
        this._viewName = name;
        return this;
    }

    public accept(routes:any):Receiver {
        this.actionStateRoutes = routes;
        return this;
    }

    public triggerStateChange(action:Action):void {
        if (this._model == null) {
            throw new Error("model cannot be null");
        }
        if (this.doesAcceptAction(action)) {
            let actionName = action[0]
            this._model.handleStateChange(this.actionStateRoutes[actionName], action[1]);
        }
    }

    public getRenderTree():DisplayProviderNode {
        if (this._view == null) {
            throw new Error("view cannot be null")
        }
        return this._view.render(this._model);
    }

    private doesAcceptAction(action:Action):boolean {
        if (this.actionStateRoutes == null) {
            throw new Error("action routes cannot be null");
        }
        let actionName = action[0]
        return this.actionStateRoutes.hasOwnProperty(actionName);
    }
}