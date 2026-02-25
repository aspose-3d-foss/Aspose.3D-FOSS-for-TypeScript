import { KeyframeSequence } from './KeyframeSequence';
import { Interpolation } from './Interpolation';
import { BindPoint } from './BindPoint';
import { KeyFrame } from './KeyFrame';

export class AnimationChannel extends KeyframeSequence {
    private _componentType: any = null;
    private _defaultValue: any = null;
    private _keyframeSequence: KeyframeSequence = null;

    constructor(name: string = null) {
        super(name);
    }

    get componentType(): any {
        return this._componentType;
    }

    get defaultValue(): any {
        return this._defaultValue;
    }

    set defaultValue(value: any) {
        this._defaultValue = value;
    }

    get keyframeSequence(): KeyframeSequence {
        return this._keyframeSequence;
    }

    set keyframeSequence(value: KeyframeSequence) {
        this._keyframeSequence = value;
    }
}
