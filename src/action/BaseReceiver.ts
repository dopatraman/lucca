import { Receiver } from '../core/Receiver.interface';
import { Model } from '../core/Model.interface';
import { View } from '../core/View.interface';
import { Action, DisplayProviderNode } from '../core/core.type'

export class BaseReceiver implements Receiver {
    private name:string;
    private modelLookup:Map<string, Model>;
    private viewLookup:Map<string, View<DisplayProviderNode>>;
    private _model:Model;
    private _view:View<DisplayProviderNode>;
    private actionStateRoutes:any;
    private dependencies: string[];

    constructor(name:string, modelLookup:Map<string, Model>, viewLookup:Map<string, View<DisplayProviderNode>>) {
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

    public accept(routes:any):Receiver {
        this.actionStateRoutes = routes;
        return this;
    }

    public contains(...dependencies:string[]):Receiver {
        this.dependencies = dependencies;
        return this;
    }

    public triggerStageChange(action:Action):void {
        if (this.doesAcceptAction(action)) {
            let actionName = action[0]
            this._model.handleStateChange(this.actionStateRoutes[actionName], action[1]);
        }
    }

    public getRenderTree():DisplayProviderNode {
        return this._view.render(this._model.getData());
    }

    private doesAcceptAction(action:Action):boolean {
        let actionName = action[0]
        return this.actionStateRoutes.hasOwnProperty(actionName);
    }
}