import { FileFormat } from '../FileFormat';
import { StlLoadOptions } from './StlLoadOptions';
import { StlSaveOptions } from './StlSaveOptions';

export class StlFormat extends FileFormat {
    private static _instance: StlFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): StlFormat {
        if (!StlFormat._instance) {
            StlFormat._instance = new StlFormat();
        }
        return StlFormat._instance;
    }

    get extension(): string {
        return 'stl';
    }

    get extensions(): string[] {
        return ['stl'];
    }

    get contentType(): string {
        return 'model/stl';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '';
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

    createLoadOptions(): StlLoadOptions {
        return new StlLoadOptions();
    }

    createSaveOptions(): StlSaveOptions {
        return new StlSaveOptions(this);
    }
}
