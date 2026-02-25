import { Scene, Node } from '../src/aspose/threed';
import { Mesh } from '../src/aspose/threed/entities';
import { Vector4 } from '../src/aspose/threed/utilities';
import { StlExporter, StlSaveOptions, StlFormat } from '../src/aspose/threed/formats/stl';
import * as fs from 'fs';

describe('TestStlExporter', () => {
    it('testBasicTriangleExportAscii', () => {
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

        scene.save('/tmp/test_basic_ascii.stl', StlFormat);

        expect(fs.existsSync('/tmp/test_basic_ascii.stl')).toBe(true);
    });

    it('testBasicTriangleExportBinary', () => {
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

        scene.save('/tmp/test_basic_binary.stl', StlFormat, options);

        expect(fs.existsSync('/tmp/test_basic_binary.stl')).toBe(true);
    });

    it('testQuadTriangulation', () => {
        const scene = new Scene();
        const mesh = new Mesh("test_mesh");
        mesh.controlPoints = [
            new Vector4(0.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            new Vector4(1.0, 1.0, 0.0, 1.0),
            new Vector4(0.0, 1.0, 0.0, 1.0),
        ];
        mesh.createPolygon(0, 1, 2, 3);

        const node = new Node("test_node");
        node.entity = mesh;
        node.parentNode = scene.rootNode;

        scene.save('/tmp/test_quad_triangulation.stl', StlFormat);

        expect(fs.existsSync('/tmp/test_quad_triangulation.stl')).toBe(true);
    });

    it('testSaveOptionsProperties', () => {
        const options = new StlSaveOptions();

        expect(options.flipCoordinateSystem).toBe(false);
        expect(options.binaryMode).toBe(false);
        expect(options.scale).toBe(1.0);

        options.flipCoordinateSystem = true;
        options.binaryMode = true;
        options.scale = 2.5;

        expect(options.flipCoordinateSystem).toBe(true);
        expect(options.binaryMode).toBe(true);
        expect(options.scale).toBe(2.5);
    });

    it('testExportFormatSupport', () => {
        const stlFormat = StlFormat;
        expect(stlFormat.canExport).toBe(true);
        expect(stlFormat.canImport).toBe(true);
    });
});
