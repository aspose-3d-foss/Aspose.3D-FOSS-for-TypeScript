import { Scene } from '../Scene';
import { SaveOptions } from './SaveOptions';
import { FileFormat } from '../FileFormat';

export abstract class Exporter {
    constructor() {}

    abstract supportsFormat(fileFormat: FileFormat): boolean;

    abstract export(scene: Scene, stream: any, options: SaveOptions): void;
}
