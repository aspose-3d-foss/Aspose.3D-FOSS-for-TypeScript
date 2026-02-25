import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { LoadOptions } from '../LoadOptions';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { ThreeMfFormat } from './ThreeMfFormat';
import { ThreeMfLoadOptions } from './ThreeMfLoadOptions';
import { ThreeMfSaveOptions } from './ThreeMfSaveOptions';
import { ThreeMfFormatDetector } from './ThreeMfFormatDetector';

export abstract class ThreeMfPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new ThreeMfFormatDetector();
    }

    abstract createImporter(): Importer;

    abstract createExporter(): Exporter;

    getFileFormat(): FileFormat {
        return ThreeMfFormat.getInstance();
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

    createLoadOptions(): ThreeMfLoadOptions {
        return new ThreeMfLoadOptions();
    }

    createSaveOptions(): SaveOptions {
        return new ThreeMfSaveOptions();
    }
}
