import { SaveOptions } from '../SaveOptions';

export class ObjSaveOptions extends SaveOptions {
    private _applyUnitScale: boolean = false;
    private _pointCloud: boolean = false;
    private _verbose: boolean = false;
    private _serializeW: boolean = false;
    private _enableMaterials: boolean = true;
    private _flipCoordinateSystem: boolean = false;
    private _axisSystem: any = null;

    constructor() {
        super();
    }

    get applyUnitScale(): boolean {
        return this._applyUnitScale;
    }

    set applyUnitScale(value: boolean) {
        this._applyUnitScale = Boolean(value);
    }

    get pointCloud(): boolean {
        return this._pointCloud;
    }

    set pointCloud(value: boolean) {
        this._pointCloud = Boolean(value);
    }

    get verbose(): boolean {
        return this._verbose;
    }

    set verbose(value: boolean) {
        this._verbose = Boolean(value);
    }

    get serializeW(): boolean {
        return this._serializeW;
    }

    set serializeW(value: boolean) {
        this._serializeW = Boolean(value);
    }

    get enableMaterials(): boolean {
        return this._enableMaterials;
    }

    set enableMaterials(value: boolean) {
        this._enableMaterials = Boolean(value);
    }

    get flipCoordinateSystem(): boolean {
        return this._flipCoordinateSystem;
    }

    set flipCoordinateSystem(value: boolean) {
        this._flipCoordinateSystem = Boolean(value);
    }

    get axisSystem(): any {
        return this._axisSystem;
    }

    set axisSystem(value: any) {
        this._axisSystem = value;
    }
}
