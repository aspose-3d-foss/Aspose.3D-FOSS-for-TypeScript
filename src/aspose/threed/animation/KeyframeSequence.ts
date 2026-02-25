import { A3DObject } from '../A3DObject';
import { PropertyCollection } from '../PropertyCollection';
import { Interpolation } from './Interpolation';
import { Extrapolation } from './Extrapolation';
import { BindPoint } from './BindPoint';
import { KeyFrame } from './KeyFrame';

export class KeyframeSequence extends A3DObject {
    private _keyFrames: KeyFrame[] = [];
    private _bindPoint: BindPoint = null;
    private _preBehavior = new Extrapolation();
    private _postBehavior = new Extrapolation();

    constructor(name: string = null) {
        super(name);
    }

    reset(): void {
        this._keyFrames = [];
        this._preBehavior = new Extrapolation();
        this._postBehavior = new Extrapolation();
    }

    add(time: number, value: number, interpolation: Interpolation = Interpolation.LINEAR): void {
        const keyFrame = new KeyFrame(this, time);
        keyFrame.value = value;
        keyFrame.interpolation = interpolation;
        this._keyFrames.push(keyFrame);
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

    get bindPoint(): BindPoint {
        return this._bindPoint;
    }

    get keyFrames(): KeyFrame[] {
        return [...this._keyFrames];
    }

    get postBehavior(): Extrapolation {
        return this._postBehavior;
    }

    get preBehavior(): Extrapolation {
        return this._preBehavior;
    }
}
