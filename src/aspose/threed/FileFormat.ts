import { LoadOptions } from './formats/LoadOptions';
import { SaveOptions } from './formats/SaveOptions';

export abstract class FileFormat {
    private static _formats: Map<string, FileFormat> = new Map();
    
    constructor() {}
    
    static registerFormat(format: FileFormat): void {
        for (const ext of format.extensions) {
            FileFormat._formats.set(ext.toLowerCase(), format);
        }
        FileFormat._formats.set(format.extension.toLowerCase(), format);
    }
    
    static getFormatByExtension(extension: string): FileFormat | null {
        let ext = extension.toLowerCase();
        if (ext.startsWith('.')) {
            ext = ext.substring(1);
        }
        return FileFormat._formats.get(ext) || null;
    }

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
