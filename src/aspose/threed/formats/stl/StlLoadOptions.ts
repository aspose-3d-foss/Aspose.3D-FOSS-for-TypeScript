import { LoadOptions } from '../LoadOptions';

export class StlLoadOptions extends LoadOptions {
    private _flipCoordinateSystem: boolean = false;
    private _scale: number = 1.0;

    constructor() {
        super();
    }

    get flipCoordinateSystem(): boolean {
        return this._flipCoordinateSystem;
    }

    set flipCoordinateSystem(value: boolean) {
        this._flipCoordinateSystem = Boolean(value);
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = Number(value);
    }
}
