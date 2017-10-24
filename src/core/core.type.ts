import { VNode } from 'maquette';

export type ModelData = Map<string, any>;
export type ViewConstructor<T> = (...stuff:any[]) => T;
export type Action = string;
export type DisplayProviderNode = VNode;
export type DisplayNode = HTMLElement;