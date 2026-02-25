import { Interpolation } from './Interpolation';
import { WeightedMode } from './WeightedMode';
import { StepMode } from './StepMode';
import { KeyframeSequence } from './KeyframeSequence';
import { FVector2, FVector3, FVector4 } from '../../utilities';

export class KeyFrame {
    private _curve: KeyframeSequence;
    private _time: number;
    private _value = 0.0;
    private _interpolation = Interpolation.LINEAR;
    private _tangentWeightMode = WeightedMode.NONE;
    private _stepMode = StepMode.PREVIOUS_VALUE;
    private _nextInTangent: FVector4 = null;
    private _outTangent: FVector4 = null;
    private _outWeight = 0.0;
    private _nextInWeight = 0.0;
    private _tension = 0.0;
    private _continuity = 0.0;
    private _bias = 0.0;
    private _independentTangent = false;
    private _flat = false;
    private _timeIndependentTangent = false;

    constructor(curve: KeyframeSequence, time: number) {
        this._curve = curve;
        this._time = time;
    }

    get time(): number {
        return this._time;
    }

    set time(value: number) {
        this._time = value;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get interpolation(): Interpolation {
        return this._interpolation;
    }

    set interpolation(value: Interpolation) {
        this._interpolation = value;
    }

    get tangentWeightMode(): WeightedMode {
        return this._tangentWeightMode;
    }

    set tangentWeightMode(value: WeightedMode) {
        this._tangentWeightMode = value;
    }

    get stepMode(): StepMode {
        return this._stepMode;
    }

    set stepMode(value: StepMode) {
        this._stepMode = value;
    }

    get nextInTangent(): FVector4 {
        return this._nextInTangent;
    }

    set nextInTangent(value: FVector4) {
        this._nextInTangent = value;
    }

    get outTangent(): FVector4 {
        return this._outTangent;
    }

    set outTangent(value: FVector4) {
        this._outTangent = value;
    }

    get outWeight(): number {
        return this._outWeight;
    }

    set outWeight(value: number) {
        this._outWeight = value;
    }

    get nextInWeight(): number {
        return this._nextInWeight;
    }

    set nextInWeight(value: number) {
        this._nextInWeight = value;
    }

    get tension(): number {
        return this._tension;
    }

    set tension(value: number) {
        this._tension = value;
    }

    get continuity(): number {
        return this._continuity;
    }

    set continuity(value: number) {
        this._continuity = value;
    }

    get bias(): number {
        return this._bias;
    }

    set bias(value: number) {
        this._bias = value;
    }

    get independentTangent(): boolean {
        return this._independentTangent;
    }

    set independentTangent(value: boolean) {
        this._independentTangent = value;
    }

    get flat(): boolean {
        return this._flat;
    }

    set flat(value: boolean) {
        this._flat = value;
    }

    get timeIndependentTangent(): boolean {
        return this._timeIndependentTangent;
    }

    set timeIndependentTangent(value: boolean) {
        this._timeIndependentTangent = value;
    }
}
