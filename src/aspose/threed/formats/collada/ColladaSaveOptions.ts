import { SaveOptions } from '../SaveOptions';
import { ColladaTransformStyle } from './ColladaTransformStyle';

export class ColladaSaveOptions extends SaveOptions {
    private _flipCoordinateSystem: boolean = false;
    private _enableMaterials: boolean = true;
    private _indented: boolean = true;

    constructor() {
        super();
    }

    get flipCoordinateSystem(): boolean {
        return this._flipCoordinateSystem;
    }

    set flipCoordinateSystem(value: boolean) {
        this._flipCoordinateSystem = Boolean(value);
    }

    get enableMaterials(): boolean {
        return this._enableMaterials;
    }

    set enableMaterials(value: boolean) {
        this._enableMaterials = Boolean(value);
    }

    get indented(): boolean {
        return this._indented;
    }

    set indented(value: boolean) {
        this._indented = Boolean(value);
    }
}
