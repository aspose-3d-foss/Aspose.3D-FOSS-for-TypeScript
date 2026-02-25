import { Scene, Node } from '../src/aspose/threed';
import { ThreeMfSaveOptions, ThreeMfPlugin } from '../src/aspose/threed/formats/threemf';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector4 } from '../src/aspose/threed/utilities';

describe('Test3MFExporter', () => {
    let plugin: ThreeMfPlugin;
    let format: any;

    beforeEach(() => {
        plugin = new ThreeMfPlugin();
        format = plugin.getPluginFileFormat();
    });

    it('testSaveOptions', () => {
        const options = plugin.createSaveOptions();
        expect(options).toBeInstanceOf(ThreeMfSaveOptions);
        expect(options.enableCompression).toBe(true);
        expect(options.buildAll).toBe(true);
        expect(options.flipCoordinateSystem).toBe(false);

        options.enableCompression = false;
        expect(options.enableCompression).toBe(false);

        options.flipCoordinateSystem = true;
        expect(options.flipCoordinateSystem).toBe(true);
    });
});
