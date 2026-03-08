import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';

export class GltfSaveOptions extends SaveOptions {
    private _binaryMode: boolean = false;
    private _flipTexCoordV: boolean = true;

    constructor(fileFormat?: FileFormat) {
        super();
        if (fileFormat) {
            this._fileFormat = fileFormat;
        }
    }

    get binaryMode(): boolean {
        return this._binaryMode;
    }

    set binaryMode(value: boolean) {
        this._binaryMode = Boolean(value);
    }

    get flipTexCoordV(): boolean {
        return this._flipTexCoordV;
    }

    set flipTexCoordV(value: boolean) {
        this._flipTexCoordV = Boolean(value);
    }
}
