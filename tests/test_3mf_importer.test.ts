import { ThreeMfLoadOptions, ThreeMfPlugin } from '../src/aspose/threed/formats/threemf';

describe('Test3MFImporter', () => {
    let plugin: ThreeMfPlugin;
    let format: any;

    beforeEach(() => {
        plugin = new ThreeMfPlugin();
        format = plugin.getFileFormat();
    });

    it('testFormatDetection', () => {
        expect(format.extension).toBe('3mf');
        expect(format.extensions).toContain('3mf');
        expect(format.canImport).toBe(true);
        expect(format.canExport).toBe(true);
    });

    it('testLoadOptions', () => {
        const options = plugin.createLoadOptions();
        expect(options).toBeInstanceOf(ThreeMfLoadOptions);
        expect(options.flipCoordinateSystem).toBe(false);

        options.flipCoordinateSystem = true;
        expect(options.flipCoordinateSystem).toBe(true);
    });
});
