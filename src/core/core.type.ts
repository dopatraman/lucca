import { VNode } from 'maquette';
export type ModelData = Map<string, any>;
export type StateChange = Map<string, Map<string, number | string | boolean>>
export type HTMLNode = VNode;
export type ViewType = HTMLNode | object;
export type ViewConstructor<T> = (...stuff) => T;
export type Action = string;
