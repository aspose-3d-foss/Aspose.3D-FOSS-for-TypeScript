import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { StlFormat } from './StlFormat';
import { StlSaveOptions } from './StlSaveOptions';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';

export class StlExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof StlFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        const stlOptions = options instanceof StlSaveOptions ? options : new StlSaveOptions();
        
        const meshes = this._collectMeshes(scene.rootNode);
        
        if (meshes.length === 0) {
            throw new Error('No meshes found in scene');
        }
        
        const allTriangles = this._triangulateAll(meshes);
        
        if (stlOptions.binaryMode) {
            this._writeBinary(stream, allTriangles, stlOptions);
        } else {
            this._writeAscii(stream, allTriangles, stlOptions);
        }
    }

    private _collectMeshes(node: Node): Mesh[] {
        const meshes: Mesh[] = [];
        
        const entity = node.entity;
        if (entity && entity instanceof Mesh) {
            meshes.push(entity);
        }
        
        for (const child of node.childNodes) {
            meshes.push(...this._collectMeshes(child));
        }
        
        return meshes;
    }

    private _triangulateAll(meshes: Mesh[]): Array<[number, number, number][]> {
        const allTriangles: Array<[number, number, number][]> = [];
        
        for (const mesh of meshes) {
            const triangles: [number, number, number][] = [];
            const polygons = mesh.polygons;
            
            for (const polygon of polygons) {
                if (polygon.length === 3) {
                    triangles.push([polygon[0], polygon[1], polygon[2]]);
                } else if (polygon.length > 3) {
                    for (let i = 1; i < polygon.length - 1; i++) {
                        triangles.push([polygon[0], polygon[i], polygon[i + 1]]);
                    }
                }
            }
            
            allTriangles.push(triangles);
        }
        
        return allTriangles;
    }

    private _writeAscii(stream: any, allTriangles: Array<[number, number, number][]>, _options: StlSaveOptions): void {
        stream.write('solid Scene\n');
        
        for (const triangles of allTriangles) {
            for (const tri of triangles) {
                stream.write('  facet normal 0 0 0\n');
                stream.write('    outer loop\n');
                stream.write(`      vertex ${tri[0]} ${tri[1]} ${tri[2]}\n`);
                stream.write('    endloop\n');
                stream.write('  endfacet\n');
            }
        }
        
        stream.write('endsolid Scene\n');
    }

    private _writeBinary(stream: any, allTriangles: Array<[number, number, number][]>, _options: StlSaveOptions): void {
        let totalTriangles = 0;
        for (const triangles of allTriangles) {
            totalTriangles += triangles.length;
        }
        
        const header = Buffer.alloc(80, 0);
        header.write('Binary STL exported by Aspose.3D');
        
        const triangleCount = Buffer.alloc(4);
        triangleCount.writeUInt32LE(totalTriangles, 0);
        
        if (stream.write && typeof stream.write === 'function') {
            stream.write(header);
            stream.write(triangleCount);
        }
        
        const triangleBuffer = Buffer.alloc(50);
        
        for (const triangles of allTriangles) {
            for (const tri of triangles) {
                triangleBuffer.fill(0);
                
                triangleBuffer.writeFloatLE(0, 0);
                triangleBuffer.writeFloatLE(0, 4);
                triangleBuffer.writeFloatLE(0, 8);
                
                triangleBuffer.writeFloatLE(tri[0], 12);
                triangleBuffer.writeFloatLE(tri[1], 16);
                triangleBuffer.writeFloatLE(tri[2], 20);
                
                if (stream.write && typeof stream.write === 'function') {
                    stream.write(triangleBuffer);
                }
            }
        }
    }
}
