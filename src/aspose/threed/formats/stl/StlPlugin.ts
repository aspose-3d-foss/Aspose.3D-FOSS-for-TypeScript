import { Plugin } from '../Plugin';
import { StlImporter } from './StlImporter';
import { StlExporter } from './StlExporter';
import { StlFormatDetector } from './StlFormatDetector';
import { StlFormat } from './StlFormat';
import { StlLoadOptions } from './StlLoadOptions';
import { StlSaveOptions } from './StlSaveOptions';
import { IOService } from '../IOService';

export class StlPlugin extends Plugin {
    private static _instance: StlPlugin | null = null;
    private _importer: StlImporter;
    private _exporter: StlExporter;
    private _formatDetector: StlFormatDetector;

    constructor() {
        super();
        this._importer = new StlImporter();
        this._exporter = new StlExporter();
        this._formatDetector = new StlFormatDetector();
    }

    static getInstance(): StlPlugin {
        if (!StlPlugin._instance) {
            StlPlugin._instance = new StlPlugin();
            IOService.instance.registerPlugin(StlPlugin._instance);
        }
        return StlPlugin._instance;
    }

    getFileFormat(): StlFormat {
        return StlFormat.getInstance();
    }

    getImporter(): StlImporter {
        return this._importer;
    }

    getExporter(): StlExporter {
        return this._exporter;
    }

    getFormatDetector(): StlFormatDetector {
        return this._formatDetector;
    }

    createLoadOptions(): StlLoadOptions {
        return new StlLoadOptions();
    }

    createSaveOptions(): StlSaveOptions {
        return new StlSaveOptions();
    }
}
