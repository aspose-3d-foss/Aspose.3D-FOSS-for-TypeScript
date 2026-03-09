import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { ColladaFormat } from './ColladaFormat';
import { ColladaLoadOptions } from './ColladaLoadOptions';
import { ColladaSaveOptions } from './ColladaSaveOptions';
import { ColladaFormatDetector } from './ColladaFormatDetector';
import { ColladaImporter } from './ColladaImporter';
import { ColladaExporter } from './ColladaExporter';
import { IOService } from '../IOService';

export class ColladaPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;
    private static _instance: ColladaPlugin | null = null;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new ColladaFormatDetector();
    }

    static getInstance(): ColladaPlugin {
        if (!ColladaPlugin._instance) {
            ColladaPlugin._instance = new ColladaPlugin();
            IOService.instance.registerPlugin(ColladaPlugin._instance);
        }
        return ColladaPlugin._instance;
    }

    createImporter(): Importer {
        return new ColladaImporter();
    }

    createExporter(): Exporter {
        return new ColladaExporter();
    }

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
