import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { LoadOptions } from '../LoadOptions';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { ColladaFormat } from './ColladaFormat';
import { ColladaLoadOptions } from './ColladaLoadOptions';
import { ColladaSaveOptions } from './ColladaSaveOptions';
import { ColladaFormatDetector } from './ColladaFormatDetector';

export abstract class ColladaPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new ColladaFormatDetector();
    }

    abstract createImporter(): Importer;

    abstract createExporter(): Exporter;

    getFileFormat(): FileFormat {
        return ColladaFormat.getInstance();
    }

    getImporter(): Importer {
        return this._importer;
    }

    getExporter(): Exporter {
        return this._exporter;
    }

    getFormatDetector(): FormatDetector {
        return this._formatDetector;
    }

    createLoadOptions(): ColladaLoadOptions {
        return new ColladaLoadOptions();
    }

    createSaveOptions(): SaveOptions {
        return new ColladaSaveOptions();
    }
}
