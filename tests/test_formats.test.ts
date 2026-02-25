import { Exporter, Importer, FormatDetector, IOService, LoadOptions, SaveOptions } from '../src/aspose/threed/formats';
import { FileFormat, Scene } from '../src/aspose/threed';

describe('TestFormats', () => {
    it('testExporterCreation', () => {
        const exporter = new Exporter();
        expect(exporter).toBeDefined();
    });

    it('testImporterCreation', () => {
        const importer = new Importer();
        expect(importer).toBeDefined();
    });

    it('testFormatDetectorCreation', () => {
        const detector = new FormatDetector();
        expect(detector).toBeDefined();
    });

    it('testIoServiceSingleton', () => {
        const service1 = IOService.getInstance();
        const service2 = IOService.getInstance();
        expect(service1).toBe(service2);
    });

    it('testLoadOptionsCreation', () => {
        const options = new LoadOptions();
        expect(options).toBeDefined();
        expect(options.encoding).toBeNull();
        expect(options.fileName).toBeNull();
        expect(options.lookupPaths).toEqual([]);
    });

    it('testSaveOptionsCreation', () => {
        const options = new SaveOptions();
        expect(options).toBeDefined();
        expect(options.exportTextures).toBe(false);
    });

    it('testLoadOptionsProperties', () => {
        const options = new LoadOptions();
        options.encoding = 'utf-8';
        options.fileName = 'test.obj';
        options.lookupPaths = ['/path1', '/path2'];

        expect(options.encoding).toBe('utf-8');
        expect(options.fileName).toBe('test.obj');
        expect(options.lookupPaths).toEqual(['/path1', '/path2']);
    });

    it('testSaveOptionsProperties', () => {
        const options = new SaveOptions();
        options.exportTextures = true;

        expect(options.exportTextures).toBe(true);
    });

    it('testIoServiceRegistration', () => {
        const service = IOService.getInstance();
        const exporter = new Exporter();
        const importer = new Importer();
        const detector = new FormatDetector();

        service.registerExporter(exporter);
        service.registerImporter(importer);
        service.registerDetector(detector);

        expect(service.exporters).toContain(exporter);
        expect(service.importers).toContain(importer);
        expect(service.detectors).toContain(detector);
    });

    it('testFileFormatCreateOptions', () => {
        const fileFormat = new FileFormat();
        const loadOptions = fileFormat.createLoadOptions();
        const saveOptions = fileFormat.createSaveOptions();

        expect(loadOptions).toBeInstanceOf(LoadOptions);
        expect(saveOptions).toBeInstanceOf(SaveOptions);
        expect(loadOptions.fileFormat).toBe(fileFormat);
        expect(saveOptions.fileFormat).toBe(fileFormat);
    });
});
