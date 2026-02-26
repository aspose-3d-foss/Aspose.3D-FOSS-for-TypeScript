import { Importer } from '../Importer';
import { Scene } from '../../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../../FileFormat';
import { ObjLoadOptions } from './ObjLoadOptions';
import { ObjFormat } from './ObjFormat';
import { Vector4 } from '../../utilities/Vector4';
import { Vector2 } from '../../utilities/Vector2';
import { Mesh } from '../../entities/Mesh';
import { Node } from '../../Node';

export class ObjImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ObjFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        if (!(options instanceof ObjLoadOptions)) {
            options = new ObjLoadOptions() as any;
        }

        const oOptions = options as ObjLoadOptions;
        const vertices: Vector4[] = [];
        const normals: Vector4[] = [];
        const uvs: Vector2[] = [];

        let currentObjectName: string | null = null;
        let currentGroupName: string | null = null;
        let currentMesh: Mesh | null = null;
        let currentNode: Node | null = null;
        const currentVertexMap: { [key: number]: number } = {};

        let content = '';
        if (stream && typeof stream === 'object' && stream.read) {
            if (stream.seek) {
                stream.seek(0);
            }
            const data = stream.read();
            if (typeof data === 'string') {
                content = data;
            } else if (Buffer.isBuffer(data)) {
                content = data.toString('utf-8');
            } else {
                content = String(data);
            }
            if (stream.seek) {
                stream.seek(0);
            }
        } else {
            throw new TypeError('Stream must support read() method');
        }

        const lines = content.split('\n');
        const scale = oOptions.scale;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            const parts = trimmedLine.split(/\s+/);
            if (!parts || parts.length === 0) {
                continue;
            }

            const keyword = parts[0].toLowerCase();

            if (keyword === 'v') {
                let x = parseFloat(parts[1]);
                let y = parseFloat(parts[2]);
                let z = parseFloat(parts[3]);
                const w = parts.length > 4 ? parseFloat(parts[4]) : 1.0;

                if (oOptions.flipCoordinateSystem) {
                    [y, z] = [z, y];
                }

                vertices.push(new Vector4(x * scale, y * scale, z * scale, w));
            } else if (keyword === 'vn') {
                let nx = parseFloat(parts[1]);
                let ny = parseFloat(parts[2]);
                let nz = parseFloat(parts[3]);

                if (oOptions.normalizeNormal) {
                    const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
                    if (length > 0) {
                        nx = nx / length;
                        ny = ny / length;
                        nz = nz / length;
                    }
                }

                if (oOptions.flipCoordinateSystem) {
                    [ny, nz] = [nz, ny];
                }

                normals.push(new Vector4(nx, ny, nz, 0));
            } else if (keyword === 'vt') {
                const u = parseFloat(parts[1]);
                const v = parts.length > 2 ? parseFloat(parts[2]) : 0.0;
                uvs.push(new Vector2(u, v));
            } else if (keyword === 'f') {
                if (currentMesh === null) {
                    currentMesh = new Mesh(currentObjectName || 'mesh');
                    currentNode = new Node(currentObjectName || 'mesh');
                    (currentNode as any).entity = currentMesh;
                    currentNode.parentNode = scene.rootNode;
                    Object.keys(currentVertexMap).forEach((k) => delete currentVertexMap[parseInt(k, 10)]);
                }

                const faceIndices: number[] = [];
                const vertexNormals: [number, number][] = [];
                const vertexUvs: [number, number][] = [];

                for (let i = 1; i < parts.length; i++) {
                    const part = parts[i];
                    const indices = part.split('/');

                    let vIdx = indices[0] ? parseInt(indices[0], 10) : 0;
                    let vtIdx = indices.length > 1 && indices[1] ? parseInt(indices[1], 10) : 0;
                    let vnIdx = indices.length > 2 && indices[2] ? parseInt(indices[2], 10) : 0;

                    if (vIdx < 0) {
                        vIdx = vertices.length + vIdx;
                    } else {
                        vIdx = vIdx - 1;
                    }

                    if (vIdx < 0) {
                        vIdx = 0;
                    }

                    if (!(vIdx in currentVertexMap)) {
                        if (vIdx < vertices.length) {
                            currentVertexMap[vIdx] = currentMesh.controlPoints.length;
                            (currentMesh as any)._controlPoints.push(vertices[vIdx]);
                        } else {
                            currentVertexMap[vIdx] = currentMesh.controlPoints.length;
                            (currentMesh as any)._controlPoints.push(new Vector4(0, 0, 0, 1));
                        }
                    }

                    const localIdx = currentVertexMap[vIdx];
                    faceIndices.push(localIdx);

                    if (vtIdx < 0) {
                        vtIdx = uvs.length + vtIdx;
                    } else {
                        vtIdx = vtIdx - 1;
                    }

                    if (vnIdx < 0) {
                        vnIdx = normals.length + vnIdx;
                    } else {
                        vnIdx = vnIdx - 1;
                    }

                    if (vtIdx >= 0) {
                        vertexUvs.push([faceIndices.length - 1, vtIdx]);
                    }
                    if (vnIdx >= 0) {
                        vertexNormals.push([faceIndices.length - 1, vnIdx]);
                    }
                }

                if (faceIndices.length >= 3) {
                    currentMesh.createPolygon(faceIndices);
                }
            } else if (keyword === 'o') {
                currentObjectName = parts.length > 1 ? parts[1] : null;
                currentGroupName = null;
                currentMesh = null;
                currentNode = null;
                Object.keys(currentVertexMap).forEach((k) => delete currentVertexMap[parseInt(k, 10)]);
            } else if (keyword === 'g') {
                currentGroupName = parts.length > 1 ? parts[1] : null;
                if (currentObjectName === null) {
                    currentObjectName = currentGroupName;
                }
                currentMesh = null;
                currentNode = null;
                Object.keys(currentVertexMap).forEach((k) => delete currentVertexMap[parseInt(k, 10)]);
            } else if (keyword === 's') {
            } else if (keyword === 'usemtl' && oOptions.enableMaterials) {
            }
        }
    }
}
