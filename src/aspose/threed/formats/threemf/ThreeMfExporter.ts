import { Exporter } from '../Exporter';
import { Scene } from '../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { ThreeMfSaveOptions } from './ThreeMfSaveOptions';
import { ThreeMfFormat } from './ThreeMfFormat';

export abstract class ThreeMfExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ThreeMfFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        throw new Error('export is not implemented');
    }
}
