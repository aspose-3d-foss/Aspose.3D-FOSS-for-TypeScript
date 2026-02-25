import { Mesh } from '../src/aspose/threed';
import { PolygonModifier } from '../src/aspose/threed/entities';
import { Vector4 } from '../src/aspose/threed/utilities';

describe('testTriangulateConsistency', () => {
    it('testQuadMesh', () => {
        const quadMesh = new Mesh("quad");
        quadMesh.controlPoints = [
            new Vector4(0, 0, 0, 1),
            new Vector4(1, 0, 0, 1),
            new Vector4(0, 1, 0, 1),
            new Vector4(1, 1, 0, 1)
        ];
        quadMesh.createPolygon(0, 1, 3, 2);

        const result1 = quadMesh.triangulate();
        const result2 = PolygonModifier.triangulate(quadMesh);

        expect(result1.polygonCount).toBe(result2.polygonCount);
    });

    it('testMixedPolygonMesh', () => {
        const mixedMesh = new Mesh("mixed");
        mixedMesh.controlPoints = [
            new Vector4(0, 0, 0, 1),
            new Vector4(1, 0, 0, 1),
            new Vector4(0, 1, 0, 1),
            new Vector4(1, 1, 0, 1),
            new Vector4(2, 0, 0, 1),
            new Vector4(2, 1, 0, 1)
        ];
        mixedMesh.createPolygon(0, 1, 2);
        mixedMesh.createPolygon(1, 3, 2);
        mixedMesh.createPolygon([1, 3, 5, 4]);

        const result1 = mixedMesh.triangulate();
        const result2 = PolygonModifier.triangulate(mixedMesh);

        expect(result1.polygonCount).toBe(result2.polygonCount);
    });
});
