import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { LoadOptions } from '../LoadOptions';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { StlFormat } from './StlFormat';
import { StlLoadOptions } from './StlLoadOptions';
import { StlSaveOptions } from './StlSaveOptions';
import { StlFormatDetector } from './StlFormatDetector';

export abstract class StlPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new StlFormatDetector();
    }

    abstract createImporter(): Importer;

    abstract createExporter(): Exporter;

    getFileFormat(): FileFormat {
        return StlFormat.getInstance();
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

    createLoadOptions(): StlLoadOptions {
        return new StlLoadOptions();
    }

    createSaveOptions(): SaveOptions {
        return new StlSaveOptions(this);
    }
}
