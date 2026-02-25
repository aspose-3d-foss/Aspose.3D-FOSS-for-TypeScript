import { Scene } from '../src/aspose/threed';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector4, Vector3 } from '../src/aspose/threed/utilities';
import { GltfSaveOptions } from '../src/aspose/threed/formats/gltf';
import { PbrMaterial } from '../src/aspose/threed/shading/gltf';
import * as fs from 'fs';

describe('TestGltfExporter', () => {
    it('testSimpleTriangleAscii', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        scene.save('/tmp/test_simple.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_simple.gltf')).toBe(true);
    });

    it('testSimpleTriangleBinary', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        const options = new GltfSaveOptions();
        options.binaryMode = true;

        scene.save('/tmp/test_simple.glb', GltfFormat, options);

        expect(fs.existsSync('/tmp/test_simple.glb')).toBe(true);

        const content = fs.readFileSync('/tmp/test_simple.glb');
        expect(content.length).toBeGreaterThan(0);
    });

    it('testExportWithPositions', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        scene.save('/tmp/test_positions.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_positions.gltf')).toBe(true);
    });

    it('testExportWithNormals', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const normalElement = VertexElementNormal;
        mesh.vertexElements.push(normalElement);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        scene.save('/tmp/test_normales.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_normales.gltf')).toBe(true);
    });

    it('testExportWithUvs', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const uvElement = VertexElementUV;
        mesh.vertexElements.push(uvElement);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        scene.save('/tmp/test_uvs.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_uvs.gltf')).toBe(true);
    });

    it('testFlipTexCoordV', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const uvElement = VertexElementUV;
        mesh.vertexElements.push(uvElement);

        scene.rootNode.createChildNode('TestNode').entity = mesh;

        const exporter = GltfExporter;

        const options1 = new GltfSaveOptions();
        options1.binaryMode = false;
        options1.flipTexCoordV = true;

        const options2 = new GltfSaveOptions();
        options2.binaryMode = false;
        options2.flipTexCoordV = false;

        scene.save('/tmp/test_flip1.gltf', GltfFormat, options1);
        scene.save('/tmp/test_flip2.gltf', GltfFormat, options2);

        expect(fs.existsSync('/tmp/test_flip1.gltf')).toBe(true);
        expect(fs.existsSync('/tmp/test_flip2.gltf')).toBe(true);
    });

    it('testGltfFormatCanExport', () => {
        const gltfFormat = GltfFormat;
        expect(gltfFormat.canExport).toBe(true);
    });

    it('testExportWithMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const albedo = new Vector3(0.8, 0.2, 0.3);
        const material = new PbrMaterial('RedMaterial', albedo);
        material.metallicFactor = 0.5;
        material.roughnessFactor = 0.7;

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_material.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_material.gltf')).toBe(true);
    });

    it('testExportWithEmissiveMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const material = new PbrMaterial('GlowMaterial');
        material.albedo = new Vector3(1.0, 1.0, 1.0);
        material.emissiveColor = new Vector3(0.5, 0.2, 0.1);

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_emissive.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_emissive.gltf')).toBe(true);
    });

    it('testExportWithTransparentMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const material = new PbrMaterial('TransparentMaterial');
        material.albedo = new Vector3(1.0, 1.0, 1.0);
        material.transparency = 0.6;

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_transparent.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_transparent.gltf')).toBe(true);
    });

    it('testExportWithBlendMaterial', () => {
        const scene = new Scene();
        const mesh = new Mesh('TestMesh');

        mesh.controlPoints.push(new Vector4(0.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(1.0, 0.0, 0.0, 1.0));
        mesh.controlPoints.push(new Vector4(0.0, 1.0, 0.0, 1.0));
        mesh.createPolygon(0, 1, 2);

        const material = new PbrMaterial('BlendMaterial');
        material.albedo = new Vector3(1.0, 1.0, 1.0);
        material.transparency = 1.0;

        const node = scene.rootNode.createChildNode('TestNode');
        node.entity = mesh;
        node.material = material;

        scene.save('/tmp/test_blend.gltf', GltfFormat);

        expect(fs.existsSync('/tmp/test_blend.gltf')).toBe(true);
    });
});
