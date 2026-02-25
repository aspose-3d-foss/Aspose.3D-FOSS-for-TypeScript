import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';

export class GltfSaveOptions extends SaveOptions {
    private _fileFormat: FileFormat | null = null;
    private _binaryMode: boolean = false;
    private _flipTexCoordV: boolean = true;

    constructor(fileFormat?: FileFormat) {
        super();
        if (fileFormat) {
            this._fileFormat = fileFormat;
        }
    }

    get fileFormat(): FileFormat | null {
        return this._fileFormat;
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
