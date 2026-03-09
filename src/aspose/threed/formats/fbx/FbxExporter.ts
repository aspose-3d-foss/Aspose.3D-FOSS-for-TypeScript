import { Exporter } from '../Exporter';
import { SaveOptions } from '../SaveOptions';
import { Scene } from '../../Scene';
import { FileFormat } from '../../FileFormat';
import { FbxFormat } from './FbxFormat';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';

export class FbxExporter extends Exporter {
    private _output: string = '';
    private _indent: number = 0;
    private _objectCount: number = 0;

    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof FbxFormat;
    }

    export(scene: Scene, stream: any, _options: SaveOptions): void {
        this._output = '';
        this._indent = 0;
        this._objectCount = 0;

        this._writeHeader();

        const objects: { meshes: Mesh[], nodes: Node[] } = { meshes: [], nodes: [] };
        this._collectObjects(scene.rootNode, objects);

        this._writeLine('Objects: {');
        this._indent++;

        for (const node of objects.nodes) {
            this._writeNode(node);
        }

        for (const mesh of objects.meshes) {
            this._writeGeometry(mesh);
        }

        this._indent--;
        this._writeLine('}');

        this._writeConnections(objects);

        stream.write(this._output);
    }

    private _collectObjects(node: Node, objects: { meshes: Mesh[], nodes: Node[] }): void {
        objects.nodes.push(node);

        if (node.entity instanceof Mesh) {
            objects.meshes.push(node.entity);
        }

        for (const child of node.childNodes) {
            this._collectObjects(child, objects);
        }
    }

    private _writeHeader(): void {
        this._writeLine('FBXHeaderExtension: {');
        this._indent++;
        this._writeLine('FBXHeaderVersion: 1003');
        this._writeLine('FBXVersion: 7400');
        this._writeLine('Creator: "Aspose.3D for TypeScript"');
        this._indent--;
        this._writeLine('}');
        this._writeLine('');
        this._writeLine('GlobalSettings: {');
        this._indent++;
        this._writeLine('Version: 1000');
        this._writeLine('Properties70: {');
        this._indent++;
        this._writeLine('P: "UpAxis", "int", "Integer", "",0');
        this._writeLine('P: "UpAxisSign", "int", "Integer", "",1');
        this._writeLine('P: "FrontAxis", "int", "Integer", "",2');
        this._writeLine('P: "FrontAxisSign", "int", "Integer", "",1');
        this._writeLine('P: "CoordAxis", "int", "Integer", "",0');
        this._writeLine('P: "CoordAxisSign", "int", "Integer", "",1');
        this._indent--;
        this._writeLine('}');
        this._indent--;
        this._writeLine('}');
        this._writeLine('');
    }

    private _writeNode(node: Node): void {
        const nodeId = ++this._objectCount;
        const nodeName = node.name || 'Node';
        
        this._writeLine('Model: ' + nodeId + ', "Model::' + nodeName + '", "Mesh" {');
        this._indent++;
        this._writeLine('Version: 232');
        this._writeLine('Properties70: {');
        this._indent++;
        
        const transform = node.transform;
        if (transform) {
            const translation = transform.translation;
            const eulerAngles = transform.eulerAngles;
            const scaling = transform.scaling;
            
            this._writeLine('P: "Lcl Translation", "Lcl Translation", "", "A",' + 
                translation.x + ',' + translation.y + ',' + translation.z);
            this._writeLine('P: "Lcl Rotation", "Lcl Rotation", "", "A",' + 
                eulerAngles.x + ',' + eulerAngles.y + ',' + eulerAngles.z);
            this._writeLine('P: "Lcl Scaling", "Lcl Scaling", "", "A",' + 
                scaling.x + ',' + scaling.y + ',' + scaling.z);
        }
        
        this._indent--;
        this._writeLine('}');
        this._indent--;
        this._writeLine('}');
    }

    private _writeGeometry(mesh: Mesh): void {
        const geomId = ++this._objectCount;
        const meshName = mesh.name || 'Mesh';
        
        this._writeLine('Geometry: ' + geomId + ', "Geometry::' + meshName + '", "Mesh" {');
        this._indent++;
        
        this._writeLine('Vertices: *' + mesh.controlPoints.length * 3 + ' {');
        this._indent++;
        this._write('a: ');
        const vertices: number[] = [];
        for (const cp of mesh.controlPoints) {
            vertices.push(cp.x, cp.y, cp.z);
        }
        this._output += vertices.join(',') + '\n';
        this._indent--;
        this._writeLine('}');
        
        const polygonIndices: number[] = [];
        const allPolygons = mesh.polygons;
        for (const polygon of allPolygons) {
            for (let j = 0; j < polygon.length; j++) {
                if (j === polygon.length - 1) {
                    polygonIndices.push(-polygon[j] - 1);
                } else {
                    polygonIndices.push(polygon[j]);
                }
            }
        }
        
        this._writeLine('PolygonVertexIndex: *' + polygonIndices.length + ' {');
        this._indent++;
        this._write('a: ');
        this._output += polygonIndices.join(',') + '\n';
        this._indent--;
        this._writeLine('}');
        
        this._writeLine('GeometryVersion: 124');
        
        this._indent--;
        this._writeLine('}');
    }

    private _writeConnections(objects: { meshes: Mesh[], nodes: Node[] }): void {
        this._writeLine('Connections: {');
        this._indent++;
        
        let modelId = 0;
        let geomId = objects.nodes.length;
        
        for (const _node of objects.nodes) {
            modelId++;
            geomId++;
            
            this._writeLine('C: "OO",' + geomId + ',' + modelId);
        }
        
        this._indent--;
        this._writeLine('}');
    }

    private _writeLine(text: string): void {
        this._output += '    '.repeat(this._indent) + text + '\n';
    }

    private _write(text: string): void {
        this._output += '    '.repeat(this._indent) + text;
    }
}
