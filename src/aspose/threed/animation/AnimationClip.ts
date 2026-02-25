import { SceneObject } from '../SceneObject';
import { Property } from '../Property';
import { PropertyCollection } from '../PropertyCollection';
import { AnimationNode } from './AnimationNode';

export class AnimationClip extends SceneObject {
    private _animations: AnimationNode[] = [];
    private _description = '';
    private _start = 0.0;
    private _stop = 0.0;

    constructor(name: string = null) {
        super(name);
    }

    createAnimationNode(nodeName: string): AnimationNode {
        const node = new AnimationNode(nodeName);
        this._animations.push(node);
        return node;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get properties(): PropertyCollection {
        return this._properties;
    }

    get animations(): AnimationNode[] {
        return [...this._animations];
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get stop(): number {
        return this._stop;
    }

    set stop(value: number) {
        this._stop = value;
    }
}
