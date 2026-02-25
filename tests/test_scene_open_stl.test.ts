import { Scene } from '../src/aspose/threed';
import { StlFormat } from '../src/aspose/threed/formats/stl';

describe('TestSceneOpenSTL', () => {
    it('testSceneOpenAsciiStlFile', () => {
        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/stl/stl_ascii.stl';

        if (require('fs').existsSync(file_path)) {
            const scene = Scene.fromFile(file_path);

            expect(scene.rootNode).toBeDefined();
            expect(scene.rootNode.childNodes.length).toBe(1);

            const node = scene.rootNode.childNodes[0];
            expect(node.entity).toBeDefined();

            const mesh = node.entity;
            expect(mesh.controlPoints.length).toBe(6000);
            expect(mesh.polygonCount).toBe(2000);
            expect(node.name).toBe("Object01");
        } else {
            pending(`File not found: ${file_path}`);
        }
    });

    it('testSceneOpenBinaryStlFile', () => {
        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/stl/stl_binary.stl';

        if (require('fs').existsSync(file_path)) {
            const scene = Scene.fromFile(file_path);

            expect(scene.rootNode).toBeDefined();
            expect(scene.rootNode.childNodes.length).toBe(1);

            const node = scene.rootNode.childNodes[0];
            expect(node.entity).toBeDefined();

            const mesh = node.entity;
            expect(mesh.controlPoints.length).toBe(6000);
            expect(mesh.polygonCount).toBe(2000);
        } else {
            pending(`File not found: ${file_path}`);
        }
    });
});
