import { Importer } from '../Importer';
import { Scene } from '../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../FileFormat';
import { ColladaLoadOptions } from './ColladaLoadOptions';

export abstract class ColladaImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ColladaFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        throw new Error('importScene is not implemented');
    }
}
