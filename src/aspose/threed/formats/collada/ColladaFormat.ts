import { FileFormat } from '../FileFormat';
import { ColladaLoadOptions } from './ColladaLoadOptions';
import { ColladaSaveOptions } from './ColladaSaveOptions';

export class ColladaFormat extends FileFormat {
    private static _instance: ColladaFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): ColladaFormat {
        if (!ColladaFormat._instance) {
            ColladaFormat._instance = new ColladaFormat();
        }
        return ColladaFormat._instance;
    }

    get extension(): string {
        return 'dae';
    }

    get extensions(): string[] {
        return ['dae'];
    }

    get contentType(): string {
        return 'model/vnd.collada+xml';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '1.4.1';
    }

    get canExport(): boolean {
        return true;
    }

    get canImport(): boolean {
        return true;
    }

    get formats(): any[] {
        return [];
    }

    createLoadOptions(): ColladaLoadOptions {
        return new ColladaLoadOptions();
    }

    createSaveOptions(): ColladaSaveOptions {
        return new ColladaSaveOptions();
    }
}
