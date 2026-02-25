import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { LoadOptions } from '../LoadOptions';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { GltfFormat } from './GltfFormat';
import { GltfLoadOptions } from './GltfLoadOptions';
import { GltfSaveOptions } from './GltfSaveOptions';
import { GltfFormatDetector } from './GltfFormatDetector';

export abstract class GltfPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new GltfFormatDetector();
    }

    abstract createImporter(): Importer;

    abstract createExporter(): Exporter;

    getFileFormat(): FileFormat {
        return GltfFormat.getInstance();
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

    createLoadOptions(): GltfLoadOptions {
        return new GltfLoadOptions();
    }

    createSaveOptions(): GltfSaveOptions {
        return new GltfSaveOptions();
    }
}
