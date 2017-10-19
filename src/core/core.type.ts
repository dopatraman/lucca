import { VNode } from 'maquette';
export type ModelData = Map<string, any>;
export type StateChange = Map<string, Map<string, number | string | boolean>>
export type ViewType = VNode | object;
export type HTMLNode = VNode;
export type ViewConstructor<T> = (...stuff) => T;
export type Action = string;
