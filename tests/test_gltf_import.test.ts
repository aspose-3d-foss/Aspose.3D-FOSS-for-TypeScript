import { Scene } from '../src/aspose/threed';
import { GltfLoadOptions } from '../src/aspose/threed/formats/gltf';

describe('TestGltfImport', () => {
    it('testGltfLoadOptions', () => {
        const options = new GltfLoadOptions();
        expect(options).toBeDefined();
        expect(options.flipTexCoordV).toBe(true);
    });

    it('testGltfLoadOptionsFlipProperty', () => {
        const options = new GltfLoadOptions();
        options.flipTexCoordV = false;
        expect(options.flipTexCoordV).toBe(false);
    });

    it('testGltfFormatDetection', () => {
        const gltfFormat = FileFormat.getFormatByExtension('.gltf');
        expect(gltfFormat).toBeDefined();
        expect(gltfFormat.extension).toBe('gltf');

        const glbFormat = FileFormat.getFormatByExtension('.glb');
        expect(glbFormat).toBeDefined();
    });

    it('testGltfFormatProperties', () => {
        const gltfFormat = GltfFormat;
        expect(gltfFormat.canImport).toBe(true);
        expect(gltfFormat.canExport).toBe(true);
        expect(gltfFormat.version).toBe('2.0');
        expect(gltfFormat.extensions).toContain('gltf');
        expect(gltfFormat.extensions).toContain('glb');
    });

    it('testGltfPluginRegistered', () => {
        const ioService = IOService.getInstance();
        const gltfPlugin = ioService.getPluginForExtension('.gltf');
        expect(gltfPlugin).toBeDefined();
        expect(gltfPlugin.getConstructorName()).toBe('GltfPlugin');
    });
});
