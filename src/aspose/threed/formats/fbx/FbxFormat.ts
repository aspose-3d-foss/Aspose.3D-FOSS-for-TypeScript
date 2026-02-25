import { FileFormat } from '../FileFormat';

export class FbxFormat extends FileFormat {
    private static _instance: FbxFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): FbxFormat {
        if (!FbxFormat._instance) {
            FbxFormat._instance = new FbxFormat();
        }
        return FbxFormat._instance;
    }

    get extension(): string {
        return 'fbx';
    }

    get extensions(): string[] {
        return ['fbx'];
    }

    get contentType(): string {
        return 'application/octet-stream';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '7400';
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

    createLoadOptions(): FbxLoadOptions {
        return new FbxLoadOptions();
    }

    createSaveOptions(): FbxSaveOptions {
        return new FbxSaveOptions();
    }
}
