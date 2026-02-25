import { Scene, Node } from '../src/aspose/threed';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector4 } from '../src/aspose/threed/utilities';
import { StlFormat, StlSaveOptions } from '../src/aspose/threed/formats/stl';
import * as fs from 'fs';

describe('TestSceneSaveSTL', () => {
    it('testSceneSaveToFileAscii', () => {
        const scene = new Scene();
        const mesh = new Mesh("test_mesh");
        mesh.controlPoints = [
            new Vector4(0.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 1.0, 0.0, 1.0),
            new Vector4(0.0, 1.0, 0.0, 1.0),
        ];
        mesh.createPolygon(0, 1, 2);
        mesh.createPolygon(0, 2, 3);

        const node = new Node("test_node");
        node.entity = mesh;
        node.parentNode = scene.rootNode;

        scene.save('/tmp/test_scene_ascii.stl');

        expect(fs.existsSync('/tmp/test_scene_ascii.stl')).toBe(true);
        const content = fs.readFileSync('/tmp/test_scene_ascii.stl', 'utf8');
        expect(content.includes("solid")).toBe(true);
        expect(content.includes("endsolid")).toBe(true);
    });

    it('testSceneSaveToFileBinary', () => {
        const scene = new Scene();
        const mesh = new Mesh("test_mesh");
        mesh.controlPoints = [
            new Vector4(0.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 1.0, 0.0, 1.0),
        ];
        mesh.createPolygon(0, 1, 2);

        const node = new Node("test_node");
        node.entity = mesh;
        node.parentNode = scene.rootNode;

        const options = new StlSaveOptions();
        options.binaryMode = true;

        scene.save('/tmp/test_scene_binary.stl', StlFormat, options);

        expect(fs.existsSync('/tmp/test_scene_binary.stl')).toBe(true);
        const content = fs.readFileSync('/tmp/test_scene_binary.stl');
        expect(content.length).toBeGreaterThan(0);
    });

    it('testRoundtripFile', () => {
        const scene1 = new Scene();
        const mesh1 = new Mesh("original");
        mesh1.controlPoints = [
            new Vector4(0.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 1.0, 0.0, 1.0),
        ];
        mesh1.createPolygon(0, 1, 2);

        const node1 = new Node("original_node");
        node1.entity = mesh1;
        node1.parentNode = scene1.rootNode;

        scene1.save('/tmp/test_roundtrip.stl');

        const scene2 = Scene.fromFile('/tmp/test_roundtrip.stl');

        expect(scene2.rootNode.childNodes.length).toBe(1);
        const node2 = scene2.rootNode.childNodes[0];
        const mesh2 = node2.entity;
        expect(mesh2.polygonCount).toBe(1);
    });
});
