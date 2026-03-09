import { IOService } from '../src/aspose/threed/formats';
import { StlLoadOptions } from '../src/aspose/threed/formats/stl';
import { StlSaveOptions } from '../src/aspose/threed/formats/stl';

describe('TestFormats', () => {
    it('testIoServiceSingleton', () => {
        const service1 = IOService.instance;
        const service2 = IOService.instance;
        expect(service1).toBe(service2);
    });

    it('testLoadOptionsCreation', () => {
        const options = new StlLoadOptions();
        expect(options).toBeDefined();
    });

    it('testSaveOptionsCreation', () => {
        const options = new StlSaveOptions();
        expect(options).toBeDefined();
        expect(options.exportTextures).toBe(false);
    });

    it('testSaveOptionsProperties', () => {
        const options = new StlSaveOptions();
        options.exportTextures = true;

        expect(options.exportTextures).toBe(true);
    });
});
