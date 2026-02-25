import { Exporter } from '../Exporter';
import { Scene } from '../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { ObjSaveOptions } from './ObjSaveOptions';
import { ObjFormat } from './ObjFormat';

export abstract class ObjExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ObjFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        throw new Error('export is not implemented');
    }
}
