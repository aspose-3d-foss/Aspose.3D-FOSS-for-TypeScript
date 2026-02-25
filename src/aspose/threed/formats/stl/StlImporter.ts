import { Importer } from '../Importer';
import { Scene } from '../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../FileFormat';
import { StlLoadOptions } from './StlLoadOptions';

export abstract class StlImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof StlFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        throw new Error('importScene is not implemented');
    }
}
