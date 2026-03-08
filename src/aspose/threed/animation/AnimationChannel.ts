import { KeyframeSequence } from './KeyframeSequence';

export class AnimationChannel extends KeyframeSequence {
    private _componentType: any = null;
    private _defaultValue: any = null;
    private _keyframeSequence: KeyframeSequence | null = null;

    constructor(name?: string) {
        super(name ?? '');
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

    get keyframeSequence(): KeyframeSequence | null {
        return this._keyframeSequence;
    }

    set keyframeSequence(value: KeyframeSequence) {
        this._keyframeSequence = value;
    }
}
