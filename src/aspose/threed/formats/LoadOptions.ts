import { FileFormat } from '../FileFormat';

export abstract class LoadOptions {
    protected _fileFormat: FileFormat | null = null;
    protected _encoding: string | null = null;
    protected _fileSystem: any | null = null;
    protected _lookupPaths: string[] = [];
    protected _fileName: string | null = null;

    constructor() {}

    get fileFormat(): FileFormat | null {
        return this._fileFormat;
    }

    get encoding(): string | null {
        return this._encoding;
    }

    set encoding(value: string | null) {
        this._encoding = value;
    }

    get fileSystem(): any | null {
        return this._fileSystem;
    }

    set fileSystem(value: any | null) {
        this._fileSystem = value;
    }

    get lookupPaths(): string[] {
        return [...this._lookupPaths];
    }

    set lookupPaths(value: string[]) {
        this._lookupPaths = [...value];
    }

    get fileName(): string | null {
        return this._fileName;
    }

    set fileName(value: string | null) {
        this._fileName = value;
    }
}
