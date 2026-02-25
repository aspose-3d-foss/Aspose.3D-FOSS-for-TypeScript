import { Importer } from '../Importer';
import { Scene } from '../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../FileFormat';
import { ObjLoadOptions } from './ObjLoadOptions';

export abstract class ObjImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ObjFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        throw new Error('importScene is not implemented');
    }
}
