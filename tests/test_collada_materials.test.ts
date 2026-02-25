import { Scene } from '../src/aspose/threed';
import { ColladaLoadOptions } from '../src/aspose/threed/formats/collada';

describe('TestColladaMaterials', () => {
    it('testPhongMaterialImport', () => {
        const options = new ColladaLoadOptions();
        options.enableMaterials = true;

        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/collada/cube_triangulate.dae';

        if (require('fs').existsSync(file_path)) {
            const scene = new Scene();
            scene.open(file_path, options);

            expect(scene.rootNode).toBeDefined();

            let boxNode = null;
            for (const node of scene.rootNode.childNodes) {
                if (node.name === 'Box') {
                    boxNode = node;
                    break;
                }
            }

            expect(boxNode).toBeDefined();
            expect(boxNode.material).toBeDefined();
            expect(boxNode.material.constructor.name).toBe('PhongMaterial');

            const material = boxNode.material;
            expect(material.diffuseColor).toBeDefined();
            expect(material.diffuseColor.x).toBeCloseTo(0.137255, 5);
            expect(material.diffuseColor.y).toBeCloseTo(0.403922, 5);
            expect(material.diffuseColor.z).toBeCloseTo(0.870588, 5);

            expect(material.specularColor).toBeDefined();
            expect(material.emissiveColor).toBeDefined();
            expect(material.ambientColor).toBeDefined();

            expect(material.shininess).toBeCloseTo(16.0, 1);
            expect(material.transparency).toBeCloseTo(0.0, 1);
        } else {
            pending(`File not found: ${file_path}`);
        }
    });

    it('testLambertMaterialImport', () => {
        const options = new ColladaLoadOptions();
        options.enableMaterials = true;

        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/collada/sphere.dae';

        if (require('fs').existsSync(file_path)) {
            const scene = new Scene();
            scene.open(file_path, options);

            expect(scene.rootNode).toBeDefined();

            let sphereNode = null;
            for (const node of scene.rootNode.childNodes) {
                if (node.name.toLowerCase().includes('sphere')) {
                    sphereNode = node;
                    break;
                }
            }

            expect(sphereNode).toBeDefined();
            expect(sphereNode.material).toBeDefined();
            expect(sphereNode.material.constructor.name).toBe('LambertMaterial');

            const material = sphereNode.material;
            expect(material.diffuseColor).toBeDefined();
            expect(material.diffuseColor.x).toBeCloseTo(0.5, 3);
            expect(material.diffuseColor.y).toBeCloseTo(0.5, 3);
            expect(material.diffuseColor.z).toBeCloseTo(0.5, 3);
        } else {
            pending(`File not found: ${file_path}`);
        }
    });

    it('testMaterialsDisabled', () => {
        const options = new ColladaLoadOptions();
        options.enableMaterials = false;

        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/collada/cube_triangulate.dae';

        if (require('fs').existsSync(file_path)) {
            const scene = new Scene();
            scene.open(file_path, options);

            expect(scene.rootNode).toBeDefined();

            let boxNode = null;
            for (const node of scene.rootNode.childNodes) {
                if (node.name === 'Box') {
                    boxNode = node;
                    break;
                }
            }

            expect(boxNode).toBeDefined();
            expect(boxNode.material).toBeNull();
        } else {
            pending(`File not found: ${file_path}`);
        }
    });
});
