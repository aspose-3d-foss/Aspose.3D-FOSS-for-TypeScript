import { LoadOptions } from './formats/LoadOptions';
import { SaveOptions } from './formats/SaveOptions';

export abstract class FileFormat {
    constructor() {}

    abstract get extension(): string;

    abstract get extensions(): string[];

    abstract get contentType(): string;

    abstract get fileFormatType(): any;

    abstract get version(): string;

    abstract get canExport(): boolean;

    abstract get canImport(): boolean;

    abstract get formats(): any[];

    abstract createLoadOptions(): LoadOptions;

    abstract createSaveOptions(): SaveOptions;
}
