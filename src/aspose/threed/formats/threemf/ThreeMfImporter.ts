import { Importer } from '../Importer';
import { Scene } from '../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../FileFormat';
import { ThreeMfLoadOptions } from './ThreeMfLoadOptions';

export abstract class ThreeMfImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ThreeMfFormat;
    }

    importScene(scene: Scene, stream: any, options: any): void {
        throw new Error('importScene is not implemented');
    }
}
