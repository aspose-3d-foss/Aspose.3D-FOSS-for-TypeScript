import { FileFormat } from '../FileFormat';

export abstract class FormatDetector {
    constructor() {}

    abstract detect(stream: any, fileName: string): FileFormat | null;
}
