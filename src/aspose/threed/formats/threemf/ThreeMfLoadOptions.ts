import { LoadOptions } from '../LoadOptions';

export class ThreeMfLoadOptions extends LoadOptions {
    private _flipCoordinateSystem: boolean = false;

    constructor() {
        super();
    }

    get flipCoordinateSystem(): boolean {
        return this._flipCoordinateSystem;
    }

    set flipCoordinateSystem(value: boolean) {
        this._flipCoordinateSystem = Boolean(value);
    }
}
