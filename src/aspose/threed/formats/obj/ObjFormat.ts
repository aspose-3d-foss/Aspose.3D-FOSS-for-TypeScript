import { FileFormat } from '../../FileFormat';
import { ObjLoadOptions } from './ObjLoadOptions';
import { ObjSaveOptions } from './ObjSaveOptions';

export class ObjFormat extends FileFormat {
    private static _instance: ObjFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): ObjFormat {
        if (!ObjFormat._instance) {
            ObjFormat._instance = new ObjFormat();
        }
        return ObjFormat._instance;
    }

    get extension(): string {
        return 'obj';
    }

    get extensions(): string[] {
        return ['obj'];
    }

    get contentType(): string {
        return 'model/obj';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '';
    }

    get canExport(): boolean {
        return false;
    }

    get canImport(): boolean {
        return true;
    }

    get formats(): any[] {
        return [];
    }

    createLoadOptions(): ObjLoadOptions {
        return new ObjLoadOptions();
    }

    createSaveOptions(): ObjSaveOptions {
        return new ObjSaveOptions();
    }
}
