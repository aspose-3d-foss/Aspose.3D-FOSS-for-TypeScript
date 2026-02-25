import { Exporter } from '../Exporter';
import { Scene } from '../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { GltfSaveOptions } from './GltfSaveOptions';

export abstract class GltfExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof GltfFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        throw new Error('export is not implemented');
    }
}
