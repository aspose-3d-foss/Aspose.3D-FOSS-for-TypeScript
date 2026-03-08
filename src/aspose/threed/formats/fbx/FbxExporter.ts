import { Exporter } from '../Exporter';
import { SaveOptions } from '../SaveOptions';
import { Scene } from '../../Scene';
import { FileFormat } from '../../FileFormat';
import { FbxFormat } from './FbxFormat';

export class FbxExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof FbxFormat;
    }

    export(_scene: Scene, _stream: any, _options: SaveOptions): void {
        throw new Error('FBX export is not implemented');
    }
}
