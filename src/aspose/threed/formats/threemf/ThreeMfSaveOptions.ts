import { SaveOptions } from '../SaveOptions';

export class ThreeMfSaveOptions extends SaveOptions {
    private _enableCompression: boolean = true;
    private _buildAll: boolean = true;
    private _flipCoordinateSystem: boolean = false;
    private _unit: string = 'millimeter';
    private _prettyPrint: boolean = false;

    constructor() {
        super();
    }

    get enableCompression(): boolean {
        return this._enableCompression;
    }

    set enableCompression(value: boolean) {
        this._enableCompression = Boolean(value);
    }

    get buildAll(): boolean {
        return this._buildAll;
    }

    set buildAll(value: boolean) {
        this._buildAll = Boolean(value);
    }

    get flipCoordinateSystem(): boolean {
        return this._flipCoordinateSystem;
    }

    set flipCoordinateSystem(value: boolean) {
        this._flipCoordinateSystem = Boolean(value);
    }

    get unit(): string {
        return this._unit;
    }

    set unit(value: string) {
        const validUnits = ['micron', 'millimeter', 'centimeter', 'inch', 'foot', 'meter'];
        if (!validUnits.includes(value)) {
            throw new Error(`Invalid unit. Must be one of: ${validUnits.join(', ')}`);
        }
        this._unit = value;
    }

    get prettyPrint(): boolean {
        return this._prettyPrint;
    }

    set prettyPrint(value: boolean) {
        this._prettyPrint = Boolean(value);
    }
}
