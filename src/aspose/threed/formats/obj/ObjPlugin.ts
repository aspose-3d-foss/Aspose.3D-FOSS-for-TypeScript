import { Plugin } from '../Plugin';
import { ObjImporter } from './ObjImporter';
import { ObjExporter } from './ObjExporter';
import { ObjFormatDetector } from './ObjFormatDetector';
import { ObjFormat } from './ObjFormat';
import { ObjLoadOptions } from './ObjLoadOptions';
import { ObjSaveOptions } from './ObjSaveOptions';
import { IOService } from '../IOService';

export class ObjPlugin extends Plugin {
    private static _instance: ObjPlugin | null = null;
    private _importer: ObjImporter;
    private _exporter: ObjExporter;
    private _formatDetector: ObjFormatDetector;

    constructor() {
        super();
        this._importer = new ObjImporter();
        this._exporter = new ObjExporter();
        this._formatDetector = new ObjFormatDetector();
    }

    static getInstance(): ObjPlugin {
        if (!ObjPlugin._instance) {
            ObjPlugin._instance = new ObjPlugin();
            IOService.instance.registerPlugin(ObjPlugin._instance);
        }
        return ObjPlugin._instance;
    }

    getFileFormat(): ObjFormat {
        return ObjFormat.getInstance();
    }

    getImporter(): ObjImporter {
        return this._importer;
    }

    getExporter(): ObjExporter {
        return this._exporter;
    }

    getFormatDetector(): ObjFormatDetector {
        return this._formatDetector;
    }

    createLoadOptions(): ObjLoadOptions {
        return new ObjLoadOptions();
    }

    createSaveOptions(): ObjSaveOptions {
        return new ObjSaveOptions();
    }
}
