import { VNode } from 'maquette';

export type ViewConstructor<T> = (...stuff:any[]) => T;
export type Action = string;
export type DisplayProviderNode = VNode;
export type DisplayNode = HTMLElement;