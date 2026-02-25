import { FileFormat } from '../FileFormat';
import { GltfLoadOptions } from './GltfLoadOptions';
import { GltfSaveOptions } from './GltfSaveOptions';

export class GltfFormat extends FileFormat {
    private static _instance: GltfFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): GltfFormat {
        if (!GltfFormat._instance) {
            GltfFormat._instance = new GltfFormat();
        }
        return GltfFormat._instance;
    }

    get extension(): string {
        return 'gltf';
    }

    get extensions(): string[] {
        return ['gltf', 'glb'];
    }

    get contentType(): string {
        return 'model/gltf+json';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '2.0';
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

    createLoadOptions(): GltfLoadOptions {
        return new GltfLoadOptions();
    }

    createSaveOptions(): GltfSaveOptions {
        return new GltfSaveOptions();
    }
}
