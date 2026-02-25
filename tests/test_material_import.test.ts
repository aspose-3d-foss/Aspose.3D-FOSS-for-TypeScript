import { Scene } from '../src/aspose/threed';
import { ThreeMfLoadOptions } from '../src/aspose/threed/formats/threemf';
import { PbrMaterial } from '../src/aspose/threed/shading';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector3 } from '../src/aspose/threed/utilities';
import { StlSaveOptions, StlFormat } from '../src/aspose/threed/formats/stl';
import * as fs from 'fs';

describe('testMaterialImport', () => {
    it('testSimpleCubeWithMaterial', () => {
        const scene = new Scene();
        
        const mat = new PbrMaterial('test_material');
        mat.albedo = new Vector3(1.0, 0.0, 0.0);

        const mesh = new Mesh('cube');
        mesh.controlPoints = [
            new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(1, 1, 0), new Vector3(0, 1, 0),
            new Vector3(0, 0, 1), new Vector3(1, 0, 1), new Vector3(1, 1, 1), new Vector3(0, 1, 1)
        ];
        for (const indices of [[0,1,2], [0,2,3], [4,7,6], [4,6,5], [0,4,5], [0,5,1], [2,6,7], [2,7,3], [0,3,7], [0,7,4], [1,5,6], [1,6,2]]) {
            mesh.createPolygon(...indices);
        }

        const node = scene.rootNode.createChildNode('cube');
        node.entity = mesh;
        node.material = mat;

        expect(node.name).toBe('cube');
        expect(mesh.controlPoints.length).toBe(8);
        expect(mesh.polygonCount).toBe(12);
    });
});
