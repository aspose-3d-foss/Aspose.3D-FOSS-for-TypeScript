import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../../FileFormat';
import { GltfFormat } from './GltfFormat';
import { GltfLoadOptions } from './GltfLoadOptions';
import { GltfSaveOptions } from './GltfSaveOptions';
import { GltfFormatDetector } from './GltfFormatDetector';
import { GltfImporter } from './GltfImporter';
import { GltfExporter } from './GltfExporter';

export class GltfPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;
    private static _instance: GltfPlugin | null = null;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new GltfFormatDetector();
    }

    static getInstance(): GltfPlugin {
        if (!GltfPlugin._instance) {
            GltfPlugin._instance = new GltfPlugin();
        }
        return GltfPlugin._instance;
    }

    createImporter(): Importer {
        return new GltfImporter();
    }

    createExporter(): Exporter {
        return new GltfExporter();
    }

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
