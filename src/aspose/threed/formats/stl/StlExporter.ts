import { Exporter } from '../Exporter';
import { Scene } from '../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { StlSaveOptions } from './StlSaveOptions';

export abstract class StlExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof StlFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        throw new Error('export is not implemented');
    }
}
