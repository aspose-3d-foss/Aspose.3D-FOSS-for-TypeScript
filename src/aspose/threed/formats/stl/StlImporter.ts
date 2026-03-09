import { Importer } from '../Importer';
import { Scene } from '../../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../../FileFormat';
import { StlFormat } from './StlFormat';
import { StlLoadOptions } from './StlLoadOptions';
import { Mesh } from '../../entities/Mesh';
import { Vector4 } from '../../utilities/Vector4';

export class StlImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof StlFormat;
    }

    importScene(scene: Scene, stream: Buffer | Uint8Array, options: LoadOptions): void {
        const stlOptions = options instanceof StlLoadOptions ? options : new StlLoadOptions();
        
        const buffer = stream instanceof Buffer ? stream : Buffer.from(stream);
        
        const isBinary = this._isBinarySTL(buffer);
        
        const mesh = new Mesh('STL_Mesh');
        let objectName = 'STL_Node';
        
        if (isBinary) {
            this._parseBinarySTL(buffer, mesh, stlOptions);
        } else {
            objectName = this._parseAsciiSTL(buffer, mesh, stlOptions);
        }
        
        const node = scene.rootNode.createChildNode(objectName, mesh);
        node.entity = mesh;
    }

    private _isBinarySTL(buffer: Buffer): boolean {
        if (buffer.length < 84) {
            return false;
        }
        
        const header = buffer.slice(0, 80).toString('ascii');
        if (header.toLowerCase().includes('solid')) {
            const numTriangles = buffer.readUInt32LE(80);
            const expectedSize = 84 + numTriangles * 50;
            if (buffer.length === expectedSize) {
                return true;
            }
        }
        
        const content = buffer.toString('ascii', 0, Math.min(80, buffer.length));
        if (content.toLowerCase().startsWith('solid')) {
            return false;
        }
        
        const numTriangles = buffer.readUInt32LE(80);
        const expectedSize = 84 + numTriangles * 50;
        return buffer.length === expectedSize;
    }

    private _parseAsciiSTL(buffer: Buffer, mesh: Mesh, options: StlLoadOptions): string {
        const content = buffer.toString('utf-8');
        const lines = content.split('\n');
        
        const scale = options.scale;
        const flip = options.flipCoordinateSystem;
        
        let vertexIndex = 0;
        let objectName = 'STL_Node';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const lineLower = line.toLowerCase();
            
            if (i === 0 && lineLower.startsWith('solid')) {
                const parts = line.trim().split(/\s+/);
                if (parts.length > 1) {
                    objectName = parts.slice(1).join(' ');
                }
            }
            
            if (lineLower.startsWith('vertex')) {
                const parts = lineLower.split(/\s+/);
                if (parts.length >= 4) {
                    let x = parseFloat(parts[1]) * scale;
                    let y = parseFloat(parts[2]) * scale;
                    let z = parseFloat(parts[3]) * scale;
                    
                    if (flip) {
                        [y, z] = [z, y];
                    }
                    
                    mesh.addControlPoint(new Vector4(x, y, z, 1.0));
                    vertexIndex++;
                    
                    if (vertexIndex % 3 === 0) {
                        const baseIdx = vertexIndex - 3;
                        mesh.createPolygon(baseIdx, baseIdx + 1, baseIdx + 2);
                    }
                }
            }
        }
        
        return objectName;
    }

    private _parseBinarySTL(buffer: Buffer, mesh: Mesh, options: StlLoadOptions): void {
        const numTriangles = buffer.readUInt32LE(80);
        
        const scale = options.scale;
        const flip = options.flipCoordinateSystem;
        
        let offset = 84;
        
        for (let i = 0; i < numTriangles; i++) {
            const baseVertex = mesh.controlPoints.length;
            
            for (let v = 0; v < 3; v++) {
                let x = buffer.readFloatLE(offset) * scale;
                let y = buffer.readFloatLE(offset + 4) * scale;
                let z = buffer.readFloatLE(offset + 8) * scale;
                offset += 12;
                
                if (flip) {
                    [y, z] = [z, y];
                }
                
                mesh.addControlPoint(new Vector4(x, y, z, 1.0));
            }
            
            offset += 2;
            
            mesh.createPolygon(baseVertex, baseVertex + 1, baseVertex + 2);
        }
    }
}
