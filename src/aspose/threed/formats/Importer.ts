import { Scene } from '../Scene';
import { LoadOptions } from './LoadOptions';
import { FileFormat } from '../FileFormat';

export abstract class Importer {
    constructor() {}

    abstract supportsFormat(fileFormat: FileFormat): boolean;

    abstract importScene(scene: Scene, stream: any, options: LoadOptions): void;
}
