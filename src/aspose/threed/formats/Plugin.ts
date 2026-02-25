import { LoadOptions } from './LoadOptions';
import { SaveOptions } from './SaveOptions';
import { FileFormat } from '../FileFormat';
import { Importer } from './Importer';
import { Exporter } from './Exporter';
import { FormatDetector } from './FormatDetector';

export abstract class Plugin {
    abstract getFileFormat(): FileFormat;

    abstract getImporter(): Importer;

    abstract getExporter(): Exporter;

    abstract getFormatDetector(): FormatDetector;

    abstract createLoadOptions(): LoadOptions;

    abstract createSaveOptions(): SaveOptions;
}
