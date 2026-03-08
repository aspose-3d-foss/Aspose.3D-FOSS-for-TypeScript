import { Scene } from '../src/aspose/threed';
import { StlLoadOptions, StlFormat } from '../src/aspose/threed/formats/stl';
import { Mesh } from '../src/aspose/threed/entities/Mesh';

describe('TestStlImporter', () => {
    it('testAsciiStlImport', () => {
        const scene = new Scene();
        const content = `solid TestCube
  facet normal 0.0 0.0 -1.0
    outer loop
      vertex 0.0 0.0 0.0
      vertex 1.0 0.0 0.0
      vertex 1.0 1.0 0.0
    endloop
  endfacet
  facet normal 0.0 0.0 -1.0
    outer loop
      vertex 0.0 0.0 0.0
      vertex 1.0 1.0 0.0
      vertex 0.0 1.0 0.0
    endloop
  endfacet
endsolid TestCube
`;
        const stream = new TextEncoder().encode(content);
        const options = new StlLoadOptions();

        scene.openFromBuffer(stream, options);

        expect(scene.rootNode).toBeDefined();
        expect(scene.rootNode.childNodes.length).toBe(1);

        const node = scene.rootNode.childNodes[0];
        expect(node.entity).toBeDefined();

        const mesh = node.entity as Mesh;
        expect(mesh.controlPoints.length).toBe(6);
        expect(mesh.polygonCount).toBe(2);
    });

    it('testStlFormat', () => {
        expect(StlFormat.canImport).toBe(true);
        expect(StlFormat.canExport).toBe(true);
        expect(StlFormat.extension).toBe("stl");
        expect(StlFormat.extensions).toContain("stl");
    });

    it('testLoadOptionsProperties', () => {
        const options = new StlLoadOptions();

        expect(options.flipCoordinateSystem).toBe(false);
        expect(options.scale).toBe(1.0);

        options.flipCoordinateSystem = true;
        options.scale = 2.5;

        expect(options.flipCoordinateSystem).toBe(true);
        expect(options.scale).toBe(2.5);
    });
});
