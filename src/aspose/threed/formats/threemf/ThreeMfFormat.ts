import { FileFormat } from '../FileFormat';
import { ThreeMfLoadOptions } from './ThreeMfLoadOptions';
import { ThreeMfSaveOptions } from './ThreeMfSaveOptions';

export class ThreeMfFormat extends FileFormat {
    private static _instance: ThreeMfFormat | null = null;

    constructor() {
        super();
    }

    static getInstance(): ThreeMfFormat {
        if (!ThreeMfFormat._instance) {
            ThreeMfFormat._instance = new ThreeMfFormat();
        }
        return ThreeMfFormat._instance;
    }

    get extension(): string {
        return '3mf';
    }

    get extensions(): string[] {
        return ['3mf'];
    }

    get contentType(): string {
        return 'model/3mf';
    }

    get fileFormatType(): any {
        return null;
    }

    get version(): string {
        return '1.4.0';
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

    createLoadOptions(): ThreeMfLoadOptions {
        return new ThreeMfLoadOptions();
    }

    createSaveOptions(): ThreeMfSaveOptions {
        return new ThreeMfSaveOptions();
    }

    isBuildable(node: any): boolean {
        if (!node) {
            return false;
        }

        const buildableKey = '3mf_buildable';
        const buildableValue = node.getProperty(buildableKey);
        return buildableValue !== null ? buildableValue : true;
    }

    getTransformForBuild(node: any): any | null {
        if (!node) {
            return null;
        }

        const transformKey = '3mf_build_transform';
        return node.getProperty(transformKey);
    }

    setBuildable(node: any, value: boolean, transform?: any): void {
        if (!node) {
            return;
        }

        node.setProperty('3mf_buildable', value);

        if (transform) {
            node.setProperty('3mf_build_transform', transform);
        }
    }

    setObjectType(node: any, modelType: string): void {
        if (!node) {
            return;
        }

        const validTypes = ['model', 'surface', 'solidsupport', 'support', 'other'];
        if (!validTypes.includes(modelType)) {
            throw new Error(`Invalid object type. Must be one of: ${validTypes.join(', ')}`);
        }

        node.setProperty('3mf_object_type', modelType);
    }

    getObjectType(node: any): string {
        if (!node) {
            return 'model';
        }

        const objectType = node.getProperty('3mf_object_type');
        return objectType !== null ? objectType : 'model';
    }
}
