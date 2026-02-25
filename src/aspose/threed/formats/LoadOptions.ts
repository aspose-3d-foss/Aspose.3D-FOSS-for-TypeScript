import { LoadOptions } from './LoadOptions';

export abstract class LoadOptions {
    private _fileFormat: FileFormat | null = null;
    private _encoding: string | null = null;
    private _fileSystem: any | null = null;
    private _lookupPaths: string[] = [];
    private _fileName: string | null = null;

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
