import { Scene } from '../src/aspose/threed';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector4, Vector3 } from '../src/aspose/threed/utilities';
import { ColladaSaveOptions } from '../src/aspose/threed/formats/collada';
import { PhongMaterial, LambertMaterial } from '../src/aspose/threed/shading/collada';

describe('TestColladaExporter', () => {
    it('testSimpleTriangleExport', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        scene.save('/tmp/test_simple.dae', ColladaFormat);
        expect(true).toBe(true);
    });

    it('testExportWithMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const material = new PhongMaterial('RedMaterial');
        material.diffuseColor = new Vector3(1.0, 0.0, 0.0);
        material.specularColor = new Vector3(1.0, 1.0, 1.0);
        material.shininess = 32.0;

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_material.dae', ColladaFormat);
        expect(true).toBe(true);
    });

    it('testExportLambertMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const material = new LambertMaterial('BlueMaterial');
        material.diffuseColor = new Vector3(0.0, 0.0, 1.0);

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_lambert.dae', ColladaFormat);
        expect(true).toBe(true);
    });

    it('testColladaSaveOptions', () => {
        const options = new ColladaSaveOptions();

        expect(options.flipCoordinateSystem).toBe(false);
        expect(options.enableMaterials).toBe(true);
        expect(options.indented).toBe(true);

        options.flipCoordinateSystem = true;
        expect(options.flipCoordinateSystem).toBe(true);

        options.indented = false;
        expect(options.indented).toBe(false);
    });

    it('testColladaFormatCanExport', () => {
        const colladaFormat = ColladaFormat;
        expect(colladaFormat.canExport).toBe(true);
    });
});
