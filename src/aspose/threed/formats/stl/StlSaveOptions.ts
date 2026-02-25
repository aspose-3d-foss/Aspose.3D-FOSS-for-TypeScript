import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';

export class StlSaveOptions extends SaveOptions {
    private _fileFormat: FileFormat | null = null;
    private _flipCoordinateSystem: boolean = false;
    private _scale: number = 1.0;
    private _binaryMode: boolean = false;

    constructor(fileFormat?: FileFormat) {
        super();
        if (fileFormat) {
            this._fileFormat = fileFormat;
        }
    }

    get fileFormat(): FileFormat | null {
        return this._fileFormat;
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

    get binaryMode(): boolean {
        return this._binaryMode;
    }

    set binaryMode(value: boolean) {
        this._binaryMode = Boolean(value);
    }
}
