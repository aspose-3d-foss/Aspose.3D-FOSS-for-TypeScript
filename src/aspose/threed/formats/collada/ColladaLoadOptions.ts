import { LoadOptions } from '../LoadOptions';

export class ColladaLoadOptions extends LoadOptions {
    private _flipCoordinateSystem: boolean = false;
    private _enableMaterials: boolean = true;
    private _scale: number = 1.0;
    private _normalizeNormal: boolean = true;

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

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = Number(value);
    }

    get normalizeNormal(): boolean {
        return this._normalizeNormal;
    }

    set normalizeNormal(value: boolean) {
        this._normalizeNormal = Boolean(value);
    }
}
