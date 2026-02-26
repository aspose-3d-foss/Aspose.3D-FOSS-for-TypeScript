import { Scene } from '../src/aspose/threed';
import { ThreeMfPlugin } from '../src/aspose/threed/formats/threemf';

describe('Test3MFMaterialImport', () => {
    let plugin: ThreeMfPlugin;

    beforeEach(() => {
        plugin = new ThreeMfPlugin();
    });

    it('testMaterialImport', () => {
        const scene = new Scene();
        const options = plugin.createLoadOptions();

        scene.open('/home/lexchou/workspace/aspose/3d.org/examples/3mf/dodeca_chain_loop_color.3mf', options);

        expect(scene.rootNode.childNodes.length).toBeGreaterThanOrEqual(1);
    });
});
