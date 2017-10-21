import { VNode } from 'maquette';

export type ModelData = Map<string, any>;
export type ViewConstructor<T> = (...stuff) => T;
export type Action = string;
export type DisplayProviderNode = VNode;