import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { ObjSaveOptions } from './ObjSaveOptions';
import { ObjFormat } from './ObjFormat';
import { Material } from '../../shading/Material';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';

export class ObjExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ObjFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        if (!(options instanceof ObjSaveOptions)) {
            options = new ObjSaveOptions() as any;
        }

        const oOptions = options as ObjSaveOptions;
        const lines: string[] = [];
        const nodeMap: { [key: number]: Node } = {};
        const materialMap: { [key: number]: Material } = {};

        this._collectNodes(scene.rootNode, nodeMap, materialMap);

        for (const matId in materialMap) {
            if (materialMap.hasOwnProperty(matId)) {
                lines.push('');
                lines.push(...this._writeMaterial(materialMap[parseInt(matId, 10)], parseInt(matId, 10)));
            }
        }

        lines.push('');

        const sortedNodeIds = Object.keys(nodeMap).map((id) => parseInt(id, 10)).sort((a, b) => a - b);
        for (const nodeId of sortedNodeIds) {
            const node = nodeMap[nodeId];
            const nodeName = (node as any).name;
            lines.push(...this._writeNode(node, nodeId, nodeName));
            const mesh = node.entity as Mesh;
            if (mesh !== undefined) {
                lines.push(...this._writeMeshData(mesh, oOptions));
                lines.push(...this._writeFaces(mesh));
            }
        }

        const content = lines.join('\n');

        if (stream && typeof stream === 'object' && stream.write) {
            stream.write(content);
        } else {
            throw new TypeError('Stream must support write() method');
        }
    }

    private _collectNodes(node: Node, nodeMap: { [key: number]: Node }, materialMap: { [key: number]: Material }, nodeId: number = 0): number {
        const mesh = node.entity as Mesh;
        if (mesh !== undefined && !Object.values(nodeMap).includes(node)) {
            nodeMap[nodeId] = node;

            const material = node.material;
            if (material !== undefined && !Object.values(materialMap).includes(material)) {
                materialMap[id(material)] = material;
            }

            for (const child of node.childNodes) {
                nodeId = this._collectNodes(child, nodeMap, materialMap, nodeId + 1);
            }
        }

        return nodeId;
    }

    private _writeMaterial(material: Material, matId: number): string[] {
        const lines: string[] = [];
        const matName = (material as any).name || `Material_${matId}`;
        lines.push(`newmtl ${matName}`);

        if ((material as any).diffuseColor) {
            const dc = (material as any).diffuseColor;
            if (dc) {
                lines.push(`Kd ${dc.x.toFixed(6)} ${dc.y.toFixed(6)} ${dc.z.toFixed(6)}`);
            }
        }

        if ((material as any).ambientColor) {
            const ac = (material as any).ambientColor;
            if (ac) {
                lines.push(`Ka ${ac.x.toFixed(6)} ${ac.y.toFixed(6)} ${ac.z.toFixed(6)}`);
            }
        }

        if ((material as any).specularColor) {
            const sc = (material as any).specularColor;
            if (sc) {
                lines.push(`Ks ${sc.x.toFixed(6)} ${sc.y.toFixed(6)} ${sc.z.toFixed(6)}`);
            }
        }

        if ((material as any).shininess && (material as any).shininess > 0) {
            lines.push(`Ns ${(material as any).shininess.toFixed(6)}`);
        }

        if ((material as any).transparency && (material as any).transparency > 0) {
            lines.push(`d ${(1.0 - (material as any).transparency).toFixed(6)}`);
        }

        return lines;
    }

    private _writeNode(node: Node, nodeId: number, nodeName: string | undefined): string[] {
        const lines: string[] = [];
        const name = nodeName || (node as any).name || `Node_${nodeId}`;
        lines.push(`o ${name}`);
        return lines;
    }

    private _writeMeshData(mesh: Mesh, options: ObjSaveOptions): string[] {
        const lines: string[] = [];

        for (const cp of mesh.controlPoints) {
            if (options.flipCoordinateSystem) {
                lines.push(`v ${cp.x.toFixed(6)} ${cp.z.toFixed(6)} ${cp.y.toFixed(6)}`);
            } else {
                lines.push(`v ${cp.x.toFixed(6)} ${cp.y.toFixed(6)} ${cp.z.toFixed(6)}`);
            }
        }

        lines.push('');
        return lines;
    }

    private _writeFaces(mesh: Mesh): string[] {
        const lines: string[] = [];
        const polygons = mesh.polygons;

        for (const faceIndices of polygons) {
            const line = this._formatFace(faceIndices);
            lines.push(line);
        }

        return lines;
    }

    private _formatFace(indices: number[]): string {
        return `f ${indices.map((idx) => idx + 1).join(' ')}`;
    }
}

function id(obj: any): number {
    return obj.id || Object.keys(obj).reduce((acc, key) => acc + key.charCodeAt(0), 0);
}
