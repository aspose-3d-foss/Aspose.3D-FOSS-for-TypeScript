import { Plugin } from '../Plugin';
import { Importer } from '../Importer';
import { Exporter } from '../Exporter';
import { FormatDetector } from '../FormatDetector';
import { LoadOptions } from '../LoadOptions';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../FileFormat';
import { ObjFormat } from './ObjFormat';
import { ObjLoadOptions } from './ObjLoadOptions';
import { ObjSaveOptions } from './ObjSaveOptions';
import { ObjFormatDetector } from './ObjFormatDetector';

export abstract class ObjPlugin extends Plugin {
    protected _importer: Importer;
    protected _exporter: Exporter;
    protected _formatDetector: FormatDetector;

    constructor() {
        super();
        this._importer = this.createImporter();
        this._exporter = this.createExporter();
        this._formatDetector = new ObjFormatDetector();
    }

    abstract createImporter(): Importer;

    abstract createExporter(): Exporter;

    getFileFormat(): FileFormat {
        return ObjFormat.getInstance();
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

    createLoadOptions(): ObjLoadOptions {
        return new ObjLoadOptions();
    }

    createSaveOptions(): SaveOptions {
        return new ObjSaveOptions();
    }
}
