import { Scene } from '../src/aspose/threed';
import { GltfLoadOptions } from '../src/aspose/threed/formats/gltf';
import { PbrMaterial } from '../src/aspose/threed/shading';

describe('TestGltfMaterialImport', () => {
    it('testMaterialImportFromBoombox', () => {
        const scene = new Scene();
        const options = new GltfLoadOptions();
        const file_path = '/home/lexchou/workspace/aspose/foss.3d.typescript/foss.python/examples/gltf2/BoomBox/glTF/BoomBox.gltf';

        if (require('fs').existsSync(file_path)) {
            scene.open(file_path, options);

            expect(scene.rootNode.childNodes.length).toBe(1);

            const node = scene.rootNode.childNodes[0];
            expect(node.material).toBeDefined();
            expect(node.material instanceof PbrMaterial).toBe(true);

            const material = node.material;
            expect(material.name).toBe('BoomBox_Mat');
            expect(material.albedo.x).toBe(1.0);
            expect(material.albedo.y).toBe(1.0);
            expect(material.albedo.z).toBe(1.0);
            expect(material.metallicFactor).toBe(0.0);
            expect(material.roughnessFactor).toBe(1.0);
            expect(material.transparency).toBe(0.0);
        } else {
            pending(`File not found: ${file_path}`);
        }
    });

    it('testPbrMaterialCreation', () => {
        const material = new PbrMaterial('TestMaterial');
        
        expect(material.name).toBe('TestMaterial');
        expect(material.metallicFactor).toBe(0.0);
        expect(material.roughnessFactor).toBe(0.0);
        expect(material.transparency).toBe(0.0);
    });

    it('testMaterialPropertySetters', () => {
        const material = new PbrMaterial();

        material.metallicFactor = 0.8;
        expect(material.metallicFactor).toBe(0.8);

        material.roughnessFactor = 0.3;
        expect(material.roughnessFactor).toBe(0.3);

        material.transparency = 0.5;
        expect(material.transparency).toBe(0.5);

        material.emissiveColor = Vector3(0.1, 0.2, 0.3);
        expect(material.emissiveColor.x).toBeCloseTo(0.1, 3);
        expect(material.emissiveColor.y).toBeCloseTo(0.2, 3);
        expect(material.emissiveColor.z).toBeCloseTo(0.3, 3);
    });
});
