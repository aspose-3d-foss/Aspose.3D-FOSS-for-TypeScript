import { Plugin } from '../Plugin';
import { ThreeMfImporter } from './ThreeMfImporter';
import { ThreeMfExporter } from './ThreeMfExporter';
import { ThreeMfFormatDetector } from './ThreeMfFormatDetector';
import { ThreeMfFormat } from './ThreeMfFormat';
import { ThreeMfLoadOptions } from './ThreeMfLoadOptions';
import { ThreeMfSaveOptions } from './ThreeMfSaveOptions';

export class ThreeMfPlugin extends Plugin {
    private static _instance: ThreeMfPlugin | null = null;
    private _importer: ThreeMfImporter;
    private _exporter: ThreeMfExporter;
    private _formatDetector: ThreeMfFormatDetector;

    constructor() {
        super();
        this._importer = new ThreeMfImporter();
        this._exporter = new ThreeMfExporter();
        this._formatDetector = new ThreeMfFormatDetector();
    }

    static getInstance(): ThreeMfPlugin {
        if (!ThreeMfPlugin._instance) {
            ThreeMfPlugin._instance = new ThreeMfPlugin();
        }
        return ThreeMfPlugin._instance;
    }

    getFileFormat(): ThreeMfFormat {
        return ThreeMfFormat.getInstance();
    }

    getImporter(): ThreeMfImporter {
        return this._importer;
    }

    getExporter(): ThreeMfExporter {
        return this._exporter;
    }

    getFormatDetector(): ThreeMfFormatDetector {
        return this._formatDetector;
    }

    createLoadOptions(): ThreeMfLoadOptions {
        return new ThreeMfLoadOptions();
    }

    createSaveOptions(): ThreeMfSaveOptions {
        return new ThreeMfSaveOptions();
    }
}
