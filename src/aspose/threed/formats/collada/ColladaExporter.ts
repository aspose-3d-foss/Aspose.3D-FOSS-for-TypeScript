import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { ColladaFormat } from './ColladaFormat';

export abstract class ColladaExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ColladaFormat;
    }

    export(_scene: Scene, _stream: any, _options: SaveOptions): void {
        throw new Error('export is not implemented');
    }
}
