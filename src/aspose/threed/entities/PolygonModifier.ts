import { Vector4 } from '../../utilities/Vector4';
import { Vector3 } from '../../utilities/Vector3';
import { Vector2 } from '../../utilities/Vector2';

export class PolygonModifier {
    static triangulate(arg1: any, arg2: any = null, arg3: boolean = false, arg4: any = null): any {
        if (arg1 && arg1.constructor && arg1.constructor.name === 'Scene') {
            return PolygonModifier._triangulateScene(arg1);
        } else if (arg1 && arg1.constructor && arg1.constructor.name === 'Mesh') {
            return PolygonModifier._triangulateMesh(arg1);
        } else if (Array.isArray(arg1)) {
            if (arg2 === null) {
                return [];
            } else if (typeof arg2 === 'number') {
                return PolygonModifier._triangulateSinglePolygonFromSize(arg1, arg2);
            } else if (Array.isArray(arg2)) {
                if (arg2.length > 0 && Array.isArray(arg2[0])) {
                    const generateNormals = arg3;
                    const norOut = arg4;
                    if (generateNormals && Array.isArray(norOut) && norOut.length > 0 && !Array.isArray(norOut[0])) {
                        return PolygonModifier._triangulateControlPoints(arg1, arg2, generateNormals, norOut[0]);
                    } else {
                        return PolygonModifier._triangulateControlPoints(arg1, arg2, generateNormals, norOut);
                    }
                } else {
                    return PolygonModifier._triangulateSinglePolygon(arg1, arg2);
                }
            }
        }
        throw new TypeError(`Invalid arguments for triangulate: ${typeof arg1}, ${typeof arg2}`);
    }

    static _triangulateScene(scene: any): void {
        const processNode = (node: any) => {
            if (node && node.entities) {
                for (const entity of node.entities) {
                    if (entity && entity.constructor && entity.constructor.name === 'Mesh') {
                        const triangulated = PolygonModifier._triangulateMesh(entity);
                        node.entities = [triangulated];
                    }
                }
            }
            if (node && node.childNodes) {
                for (const child of node.childNodes) {
                    processNode(child);
                }
            }
        };
        processNode(scene.rootNode);
    }

    static _triangulateMesh(mesh: any): any {
        const newMesh = new Mesh(mesh.name ? `${mesh.name}_triangulated` : 'triangulated');
        newMesh.controlPoints = [...mesh.controlPoints];

        for (const polygon of mesh.polygons) {
            PolygonModifier._triangulatePolygonToMesh(newMesh, polygon);
        }

        PolygonModifier._copyVertexElements(mesh, newMesh);

        return newMesh;
    }

    static _copyVertexElements(sourceMesh: any, targetMesh: any): void {
        for (const ve of sourceMesh.vertexElements) {
            const newVe = targetMesh.createElement(ve.vertexElementType, ve.mappingMode, ve.referenceMode);
            newVe.data = [...ve.data];
            if (ve.indices) {
                newVe.setIndices([...ve.indices]);
            }
        }
    }

    static _triangulateControlPoints(controlPoints: Vector4[], polygons: number[][], generateNormals: boolean = false, norOut: Vector3[] = null): number[][] {
        if (polygons === null) {
            polygons = [];
        }

        const result: number[][] = [];

        if (generateNormals && norOut !== null) {
            norOut = [];
        }

        for (const polygon of polygons) {
            const triangles = PolygonModifier._triangulatePolygon(controlPoints, polygon, generateNormals, norOut);
            result.push(...triangles);
        }

        return result;
    }

    static _triangulateSinglePolygonFromSize(controlPoints: Vector4[], polygonSize: number): number[][] {
        const polygon = Array.from({ length: polygonSize }, (_, i) => i);
        return PolygonModifier._triangulatePolygon(controlPoints, polygon, false, null);
    }

    static _triangulateSinglePolygon(controlPoints: Vector4[], polygon: number[]): number[][] {
        return PolygonModifier._triangulatePolygon(controlPoints, polygon, false, null);
    }

    static _triangulatePolygon(controlPoints: Vector4[], polygon: number[], generateNormals: boolean = false, norOut: Vector3[] = null): number[][] {
        const n = polygon.length;
        if (n < 3) {
            return [];
        }

        if (n === 3) {
            if (generateNormals && norOut !== null) {
                const normal = PolygonModifier._calculateNormal(controlPoints, polygon);
                norOut.push(normal);
            }
            return [[...polygon]];
        }

        let vertices = [...polygon];
        const triangles: number[][] = [];

        while (vertices.length > 3) {
            let earFound = false;
            for (let i = 0; i < vertices.length; i++) {
                const prevIdx = (i - 1 + vertices.length) % vertices.length;
                const nextIdx = (i + 1) % vertices.length;

                const prev = vertices[prevIdx];
                const curr = vertices[i];
                const nextV = vertices[nextIdx];

                if (PolygonModifier._isEar(controlPoints, vertices, prev, curr, nextV)) {
                    triangles.push([prev, curr, nextV]);

                    if (generateNormals && norOut !== null) {
                        const normal = PolygonModifier._calculateNormal(controlPoints, [prev, curr, nextV]);
                        norOut.push(normal);
                    }

                    vertices.splice(i, 1);
                    earFound = true;
                    break;
                }
            }

            if (!earFound) {
                for (let i = 1; i < vertices.length; i++) {
                    triangles.push([vertices[0], vertices[i], vertices[(i + 1) % vertices.length]]);
                    if (generateNormals && norOut !== null) {
                        const normal = PolygonModifier._calculateNormal(controlPoints, [vertices[0], vertices[i], vertices[(i + 1) % vertices.length]]);
                        norOut.push(normal);
                    }
                }
                break;
            }
        }

        if (vertices.length === 3) {
            triangles.push([...vertices]);
            if (generateNormals && norOut !== null) {
                const normal = PolygonModifier._calculateNormal(controlPoints, vertices);
                norOut.push(normal);
            }
        }

        return triangles;
    }

    static _isEar(controlPoints: Vector4[], vertices: number[], prev: number, curr: number, nextV: number): boolean {
        if (!PolygonModifier._isConvex(controlPoints, prev, curr, nextV)) {
            return false;
        }

        const p0 = new Vector3(controlPoints[prev].x, controlPoints[prev].y, controlPoints[prev].z);
        const p1 = new Vector3(controlPoints[curr].x, controlPoints[curr].y, controlPoints[curr].z);
        const p2 = new Vector3(controlPoints[nextV].x, controlPoints[nextV].y, controlPoints[nextV].z);

        for (const v of vertices) {
            if (v === prev || v === curr || v === nextV) {
                continue;
            }

            const pTest = new Vector3(controlPoints[v].x, controlPoints[v].y, controlPoints[v].z);

            if (PolygonModifier._pointInTriangle(pTest, p0, p1, p2)) {
                return false;
            }
        }

        return true;
    }

    static _isConvex(controlPoints: Vector4[], prev: number, curr: number, nextV: number): boolean {
        const pPrev = new Vector3(controlPoints[prev].x, controlPoints[prev].y, controlPoints[prev].z);
        const pCurr = new Vector3(controlPoints[curr].x, controlPoints[curr].y, controlPoints[curr].z);
        const pNext = new Vector3(controlPoints[nextV].x, controlPoints[nextV].y, controlPoints[nextV].z);

        const edge1 = new Vector3(pCurr.x - pPrev.x, pCurr.y - pPrev.y, pCurr.z - pPrev.z);
        const edge2 = new Vector3(pNext.x - pCurr.x, pNext.y - pCurr.y, pNext.z - pCurr.z);

        const cross = edge1.cross(edge2);
        const normal = PolygonModifier._calculatePolygonNormal(controlPoints, [prev, curr, nextV]);

        return cross.dot(normal) > 0;
    }

    static _pointInTriangle(p: Vector3, a: Vector3, b: Vector3, c: Vector3): boolean {
        const v0 = new Vector3(c.x - a.x, c.y - a.y, c.z - a.z);
        const v1 = new Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
        const v2 = new Vector3(p.x - a.x, p.y - a.y, p.z - a.z);

        const dot00 = v0.x * v0.x + v0.y * v0.y + v0.z * v0.z;
        const dot01 = v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
        const dot02 = v0.x * v2.x + v0.y * v2.y + v0.z * v2.z;
        const dot11 = v1.x * v1.x + v1.y * v1.y + v1.z * v1.z;
        const dot12 = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;

        const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return (u >= 0) && (v >= 0) && (u + v < 1);
    }

    static _polygonNormal(controlPoints: Vector4[], polygon: number[]): Vector3 {
        if (polygon.length < 3) {
            return new Vector3(0, 0, 1);
        }

        let normal = new Vector3(0, 0, 0);
        for (let i = 0; i < polygon.length; i++) {
            const j = (i + 1) % polygon.length;
            const p0 = new Vector3(controlPoints[polygon[i]].x, controlPoints[polygon[i]].y, controlPoints[polygon[i]].z);
            const p1 = new Vector3(controlPoints[polygon[j]].x, controlPoints[polygon[j]].y, controlPoints[polygon[j]].z);
            normal.x += (p0.y - p1.y) * (p0.z + p1.z);
            normal.y += (p0.z - p1.z) * (p0.x + p1.x);
            normal.z += (p0.x - p1.x) * (p0.y + p1.y);
        }

        return normal.normalize();
    }

    static _calculatePolygonNormal(controlPoints: Vector4[], polygon: number[]): Vector3 {
        return PolygonModifier._polygonNormal(controlPoints, polygon);
    }

    static _triangulatePolygonToMesh(mesh: any, polygon: number[]): void {
        const triangles = PolygonModifier._triangulatePolygon(mesh.controlPoints, polygon, false, null);
        for (const triangle of triangles) {
            if (triangle.length === 3) {
                mesh.createPolygon(triangle[0], triangle[1], triangle[2]);
            }
        }
    }

    static _calculateNormal(controlPoints: Vector4[], triangle: number[]): Vector3 {
        if (triangle.length < 3) {
            return new Vector3(0, 0, 1);
        }

        const v0 = controlPoints[triangle[0]];
        const v1 = controlPoints[triangle[1]];
        const v2 = controlPoints[triangle[2]];

        const p0 = new Vector3(v0.x, v0.y, v0.z);
        const p1 = new Vector3(v1.x, v1.y, v1.z);
        const p2 = new Vector3(v2.x, v2.y, v2.z);

        const edge1 = new Vector3(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z);
        const edge2 = new Vector3(p2.x - p0.x, p2.y - p0.y, p2.z - p0.z);

        const normal = edge1.cross(edge2);
        return normal.normalize();
    }
}
