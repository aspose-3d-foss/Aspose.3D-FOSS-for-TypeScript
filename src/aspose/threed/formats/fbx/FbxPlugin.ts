import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../../FileFormat';
import { FbxFormat } from './FbxFormat';
import { FbxImporter } from './FbxImporter';
import { FbxExporter } from './FbxExporter';
import { FbxFormatDetector } from './FbxFormatDetector';
import { FbxLoadOptions } from './FbxLoadOptions';
import { FbxSaveOptions } from './FbxSaveOptions';
import { IOService } from '../IOService';

export class FbxPlugin extends Plugin {
    private static _instance: FbxPlugin | null = null;
    private _importer: FbxImporter;
    private _exporter: FbxExporter;
    private _formatDetector: FbxFormatDetector;

    constructor() {
        super();
        this._importer = new FbxImporter();
        this._exporter = new FbxExporter();
        this._formatDetector = new FbxFormatDetector();
    }

    static getInstance(): FbxPlugin {
        if (!FbxPlugin._instance) {
            FbxPlugin._instance = new FbxPlugin();
            IOService.instance.registerPlugin(FbxPlugin._instance);
        }
        return FbxPlugin._instance;
    }

    getFileFormat(): FileFormat {
        return FbxFormat.getInstance();
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

    createLoadOptions(): FbxLoadOptions {
        return new FbxLoadOptions();
    }

    createSaveOptions(): FbxSaveOptions {
        return new FbxSaveOptions();
    }
}
