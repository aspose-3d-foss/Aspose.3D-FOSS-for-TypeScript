import { ExtrapolationType } from './ExtrapolationType';

export class Extrapolation {
    private _type = ExtrapolationType.CONSTANT;
    private _repeatCount = 0;

    get type(): ExtrapolationType {
        return this._type;
    }

    set type(value: ExtrapolationType) {
        this._type = value;
    }

    get repeatCount(): number {
        return this._repeatCount;
    }

    set repeatCount(value: number) {
        this._repeatCount = value;
    }
}
