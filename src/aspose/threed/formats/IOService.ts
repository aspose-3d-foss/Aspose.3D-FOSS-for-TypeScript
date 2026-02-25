import { Exporter } from './Exporter';
import { Importer } from './Importer';
import { FormatDetector } from './FormatDetector';
import { Plugin } from './Plugin';
import { FileFormat } from '../FileFormat';

export class IOService {
    private static _instance: IOService | null = null;
    private _exporters: Exporter[] = [];
    private _importers: Importer[] = [];
    private _detectors: FormatDetector[] = [];
    private _plugins: Plugin[] = [];

    private constructor() {}

    static get instance(): IOService {
        if (!this._instance) {
            this._instance = new IOService();
        }
        return this._instance;
    }

    registerExporter(exporter: Exporter): void {
        this._exporters.push(exporter);
    }

    registerImporter(importer: Importer): void {
        this._importers.push(importer);
    }

    registerDetector(detector: FormatDetector): void {
        this._detectors.push(detector);
    }

    registerPlugin(plugin: Plugin): void {
        if (this._plugins.indexOf(plugin) === -1) {
            this._plugins.push(plugin);
            this.registerImporter(plugin.getImporter());
            this.registerExporter(plugin.getExporter());
            this.registerDetector(plugin.getFormatDetector());
        }
    }

    detectFormat(stream: any, fileName: string): FileFormat | null {
        for (const detector of this._detectors) {
            const result = detector.detect(stream, fileName);
            if (result !== null) {
                return result;
            }
        }
        return null;
    }

    createExporter(formatType: FileFormat): Exporter {
        for (const exporter of this._exporters) {
            if (exporter.supportsFormat(formatType)) {
                return exporter;
            }
        }
        throw new Error(`No exporter found for format: ${formatType}`);
    }

    createImporter(formatType: FileFormat): Importer {
        for (const importer of this._importers) {
            if (importer.supportsFormat(formatType)) {
                return importer;
            }
        }
        throw new Error(`No importer found for format: ${formatType}`);
    }

    getPluginForFormat(fileFormat: FileFormat): Plugin | null {
        for (const plugin of this._plugins) {
            const pluginFormat = plugin.getFileFormat();
            if (pluginFormat && pluginFormat.constructor === fileFormat.constructor) {
                return plugin;
            }
        }
        return null;
    }

    getPluginForExtension(extension: string): Plugin | null {
        let extLower = extension.toLowerCase();
        if (extLower.startsWith('.')) {
            extLower = extLower.substring(1);
        }

        for (const plugin of this._plugins) {
            const pluginFormat = plugin.getFileFormat();
            if (pluginFormat && pluginFormat.extensions) {
                for (const fmtExt of pluginFormat.extensions) {
                    if (fmtExt.toLowerCase() === extLower) {
                        return plugin;
                    }
                }
            }
        }
        return null;
    }

    getAllPlugins(): Plugin[] {
        return [...this._plugins];
    }
}
