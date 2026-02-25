import { Exporter } from '../Exporter';
import { SaveOptions } from '../SaveOptions';
import { Scene } from '../Scene';

export class FbxExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: any): boolean {
        const { FbxFormat } = require('./FbxFormat');
        return fileFormat instanceof FbxFormat;
    }

    save(filename: string, scene: Scene, options?: SaveOptions): void {
        throw new Error('FBX export is not implemented');
    }

    saveToStream(stream: any, scene: Scene, options?: SaveOptions): void {
        throw new Error('FBX export is not implemented');
    }
}
