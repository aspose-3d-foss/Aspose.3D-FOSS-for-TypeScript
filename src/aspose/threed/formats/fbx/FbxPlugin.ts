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

export class FbxPlugin extends Plugin {
    getFileFormat(): FileFormat {
        return FbxFormat.getInstance();
    }

    getImporter(): Importer {
        return new FbxImporter();
    }

    getExporter(): Exporter {
        return new FbxExporter();
    }

    getFormatDetector(): FormatDetector {
        return new FbxFormatDetector();
    }

    createLoadOptions(): FbxLoadOptions {
        return new FbxLoadOptions();
    }

    createSaveOptions(): FbxSaveOptions {
        return new FbxSaveOptions();
    }
}
