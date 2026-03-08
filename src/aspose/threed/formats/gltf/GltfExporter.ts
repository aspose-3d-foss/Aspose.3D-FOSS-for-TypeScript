import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { GltfFormat } from './GltfFormat';
import { GltfSaveOptions } from './GltfSaveOptions';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';
import { VertexElementNormal } from '../../entities/VertexElementNormal';
import { VertexElementUV } from '../../entities/VertexElementUV';
import { PbrMaterial } from '../../shading/PbrMaterial';
import * as fs from 'fs';

interface GltfBufferView {
    buffer: number;
    byteOffset: number;
    byteLength: number;
    target?: number;
}

interface GltfAccessor {
    bufferView: number;
    byteOffset?: number;
    componentType: number;
    count: number;
    type: string;
    min?: number[];
    max?: number[];
}

interface GltfPrimitive {
    attributes: { [key: string]: number };
    indices?: number;
    material?: number;
    mode: number;
}

interface GltfMesh {
    name?: string;
    primitives: GltfPrimitive[];
}

interface GltfNode {
    name?: string;
    mesh?: number;
    children?: number[];
    translation?: number[];
    rotation?: number[];
    scale?: number[];
}

interface GltfMaterial {
    name?: string;
    pbrMetallicRoughness?: {
        baseColorFactor?: number[];
        metallicFactor?: number;
        roughnessFactor?: number;
    };
    emissiveFactor?: number[];
    alphaMode?: string;
    alphaCutoff?: number;
}

interface GltfScene {
    nodes: number[];
}

interface GltfData {
    asset: { version: string; generator: string };
    scene: number;
    scenes: GltfScene[];
    nodes: GltfNode[];
    meshes: GltfMesh[];
    accessors: GltfAccessor[];
    bufferViews: GltfBufferView[];
    buffers: { byteLength: number; uri?: string }[];
    materials?: GltfMaterial[];
}

export class GltfExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof GltfFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        const gltfOptions = options instanceof GltfSaveOptions ? options : new GltfSaveOptions();
        
        const gltfData: GltfData = {
            asset: { version: '2.0', generator: 'Aspose.3D TypeScript' },
            scene: 0,
            scenes: [{ nodes: [] }],
            nodes: [],
            meshes: [],
            accessors: [],
            bufferViews: [],
            buffers: []
        };
        
        const binaryBuffer: number[] = [];
        const materialMap: Map<PbrMaterial, number> = new Map();
        
        this._processNode(scene.rootNode, gltfData, binaryBuffer, materialMap, gltfOptions);
        
        if (gltfData.scenes[0].nodes.length === 0 && gltfData.nodes.length > 0) {
            for (let i = 0; i < gltfData.nodes.length; i++) {
                gltfData.scenes[0].nodes.push(i);
            }
        }
        
        if (binaryBuffer.length > 0) {
            gltfData.buffers.push({ byteLength: binaryBuffer.length });
        }
        
        if (gltfOptions.binaryMode) {
            this._writeGlb(gltfData, binaryBuffer, stream);
        } else {
            this._writeGltf(gltfData, binaryBuffer, stream, gltfOptions);
        }
    }

    private _processNode(
        node: Node,
        gltfData: GltfData,
        binaryBuffer: number[],
        materialMap: Map<PbrMaterial, number>,
        options: GltfSaveOptions
    ): number | null {
        const nodeIndex = gltfData.nodes.length;
        const gltfNode: GltfNode = {
            name: node.name || `node_${nodeIndex}`
        };
        gltfData.nodes.push(gltfNode);
        
        const entity = node.entity;
        if (entity && entity instanceof Mesh) {
            const nodeMaterial = node.material;
            const pbrMaterial = nodeMaterial instanceof PbrMaterial ? nodeMaterial : null;
            const meshIndex = this._processMesh(entity, gltfData, binaryBuffer, materialMap, options, pbrMaterial);
            if (meshIndex !== null) {
                gltfNode.mesh = meshIndex;
            }
        }
        
        for (const child of node.childNodes) {
            const childIndex = this._processNode(child, gltfData, binaryBuffer, materialMap, options);
            if (childIndex !== null) {
                if (!gltfNode.children) {
                    gltfNode.children = [];
                }
                gltfNode.children.push(childIndex);
            }
        }
        
        return nodeIndex;
    }

    private _processMesh(
        mesh: Mesh,
        gltfData: GltfData,
        binaryBuffer: number[],
        materialMap: Map<PbrMaterial, number>,
        options: GltfSaveOptions,
        material: PbrMaterial | null
    ): number | null {
        const controlPoints = mesh.controlPoints;
        if (controlPoints.length === 0) return null;
        
        const meshIndex = gltfData.meshes.length;
        const gltfMesh: GltfMesh = {
            name: mesh.name || `mesh_${meshIndex}`,
            primitives: []
        };
        
        const primitive: GltfPrimitive = {
            attributes: {},
            mode: 4
        };
        
        const positionBuffer = this._createPositionBuffer(controlPoints);
        const positionBufferViewIndex = this._addBufferView(gltfData, binaryBuffer, positionBuffer, 34962);
        const positionAccessorIndex = this._addAccessor(gltfData, positionBufferViewIndex, 5126, controlPoints.length, 'VEC3', this._getMinMax(positionBuffer, 3));
        primitive.attributes['POSITION'] = positionAccessorIndex;
        
        const normalElement = mesh.vertexElements.find(e => e instanceof VertexElementNormal) as VertexElementNormal | undefined;
        if (normalElement && normalElement.data) {
            const normalBuffer = this._createNormalBuffer(normalElement.data);
            const normalBufferViewIndex = this._addBufferView(gltfData, binaryBuffer, normalBuffer, 34962);
            const normalAccessorIndex = this._addAccessor(gltfData, normalBufferViewIndex, 5126, normalElement.data.length, 'VEC3');
            primitive.attributes['NORMAL'] = normalAccessorIndex;
        }
        
        const uvElement = mesh.vertexElements.find(e => e instanceof VertexElementUV) as VertexElementUV | undefined;
        if (uvElement && uvElement.uvData) {
            const uvBuffer = this._createUvBuffer(uvElement.uvData, options.flipTexCoordV);
            const uvBufferViewIndex = this._addBufferView(gltfData, binaryBuffer, uvBuffer, 34962);
            const uvAccessorIndex = this._addAccessor(gltfData, uvBufferViewIndex, 5126, uvElement.uvData.length, 'VEC2');
            primitive.attributes['TEXCOORD_0'] = uvAccessorIndex;
        }
        
        const indices = this._getTriangleIndices(mesh);
        if (indices.length > 0) {
            const indexBuffer = this._createIndexBuffer(indices);
            const indexBufferViewIndex = this._addBufferView(gltfData, binaryBuffer, indexBuffer, 34963);
            const indexAccessorIndex = this._addAccessor(gltfData, indexBufferViewIndex, 5125, indices.length, 'SCALAR');
            primitive.indices = indexAccessorIndex;
        }
        
        if (material) {
            let materialIndex = materialMap.get(material);
            if (materialIndex === undefined) {
                materialIndex = this._addMaterial(gltfData, material);
                materialMap.set(material, materialIndex);
            }
            primitive.material = materialIndex;
        }
        
        gltfMesh.primitives.push(primitive);
        gltfData.meshes.push(gltfMesh);
        
        return meshIndex;
    }

    private _addBufferView(gltfData: GltfData, binaryBuffer: number[], data: number[], target?: number): number {
        const byteOffset = binaryBuffer.length;
        binaryBuffer.push(...data);
        
        const bufferView: GltfBufferView = {
            buffer: 0,
            byteOffset: byteOffset,
            byteLength: data.length * 4
        };
        
        if (target !== undefined) {
            bufferView.target = target;
        }
        
        gltfData.bufferViews.push(bufferView);
        return gltfData.bufferViews.length - 1;
    }

    private _addAccessor(
        gltfData: GltfData,
        bufferViewIndex: number,
        componentType: number,
        count: number,
        type: string,
        minMax?: { min: number[]; max: number[] }
    ): number {
        const accessor: GltfAccessor = {
            bufferView: bufferViewIndex,
            componentType: componentType,
            count: count,
            type: type
        };
        
        if (minMax) {
            accessor.min = minMax.min;
            accessor.max = minMax.max;
        }
        
        gltfData.accessors.push(accessor);
        return gltfData.accessors.length - 1;
    }

    private _addMaterial(gltfData: GltfData, material: PbrMaterial): number {
        if (!gltfData.materials) {
            gltfData.materials = [];
        }
        
        const gltfMaterial: GltfMaterial = {
            name: material.name || `material_${gltfData.materials.length}`
        };
        
        gltfMaterial.pbrMetallicRoughness = {
            metallicFactor: material.metallicFactor,
            roughnessFactor: material.roughnessFactor
        };
        
        if (material.albedo) {
            gltfMaterial.pbrMetallicRoughness.baseColorFactor = [material.albedo.x, material.albedo.y, material.albedo.z, 1.0];
        }
        
        if (material.emissiveColor) {
            gltfMaterial.emissiveFactor = [material.emissiveColor.x, material.emissiveColor.y, material.emissiveColor.z];
        }
        
        if (material.transparency > 0 && material.transparency < 1.0) {
            gltfMaterial.alphaMode = 'BLEND';
        } else if (material.transparency === 1.0) {
            gltfMaterial.alphaMode = 'BLEND';
        }
        
        gltfData.materials.push(gltfMaterial);
        return gltfData.materials.length - 1;
    }

    private _createPositionBuffer(controlPoints: { x: number; y: number; z: number; w: number }[]): number[] {
        const buffer: number[] = [];
        for (const point of controlPoints) {
            buffer.push(point.x, point.y, point.z);
        }
        return buffer;
    }

    private _createNormalBuffer(normals: { x: number; y: number; z: number }[]): number[] {
        const buffer: number[] = [];
        for (const normal of normals) {
            buffer.push(normal.x, normal.y, normal.z);
        }
        return buffer;
    }

    private _createUvBuffer(uvs: { x: number; y: number }[], flipV: boolean): number[] {
        const buffer: number[] = [];
        for (const uv of uvs) {
            const v = flipV ? 1.0 - uv.y : uv.y;
            buffer.push(uv.x, v);
        }
        return buffer;
    }

    private _createIndexBuffer(indices: number[]): number[] {
        return [...indices];
    }

    private _getTriangleIndices(mesh: Mesh): number[] {
        const indices: number[] = [];
        const polygons = mesh.polygons;
        
        for (const polygon of polygons) {
            if (polygon.length === 3) {
                indices.push(polygon[0], polygon[1], polygon[2]);
            } else if (polygon.length === 4) {
                indices.push(polygon[0], polygon[1], polygon[2]);
                indices.push(polygon[0], polygon[2], polygon[3]);
            } else if (polygon.length > 4) {
                for (let i = 1; i < polygon.length - 1; i++) {
                    indices.push(polygon[0], polygon[i], polygon[i + 1]);
                }
            }
        }
        
        return indices;
    }

    private _getMinMax(data: number[], components: number): { min: number[]; max: number[] } {
        const count = data.length / components;
        const min: number[] = new Array(components).fill(Infinity);
        const max: number[] = new Array(components).fill(-Infinity);
        
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < components; j++) {
                const value = data[i * components + j];
                min[j] = Math.min(min[j], value);
                max[j] = Math.max(max[j], value);
            }
        }
        
        return { min, max };
    }

    private _writeGltf(gltfData: GltfData, binaryBuffer: number[], stream: any, _options: GltfSaveOptions): void {
        if (binaryBuffer.length > 0) {
            const base64 = this._arrayToBase64(binaryBuffer);
            gltfData.buffers[0].uri = `data:application/octet-stream;base64,${base64}`;
        }
        
        const jsonString = JSON.stringify(gltfData, null, 2);
        
        if (typeof stream === 'string') {
            fs.writeFileSync(stream, jsonString, 'utf-8');
        } else if (stream && typeof stream.write === 'function') {
            stream.write(jsonString);
            if (stream.close) {
                stream.close();
            }
        }
    }

    private _writeGlb(gltfData: GltfData, binaryBuffer: number[], stream: any): void {
        const jsonString = JSON.stringify(gltfData);
        const jsonBuffer = Buffer.from(jsonString, 'utf-8');
        
        const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
        const binaryPadding = (4 - (binaryBuffer.length % 4)) % 4;
        
        const jsonLength = jsonBuffer.length + jsonPadding;
        const binaryLength = binaryBuffer.length + binaryPadding;
        
        const headerLength = 12;
        const jsonChunkHeaderLength = 8;
        const binaryChunkHeaderLength = binaryBuffer.length > 0 ? 8 : 0;
        const totalLength = headerLength + jsonChunkHeaderLength + jsonLength + (binaryBuffer.length > 0 ? binaryChunkHeaderLength + binaryLength : 0);
        
        const glbBuffer = Buffer.alloc(totalLength);
        let offset = 0;
        
        glbBuffer.writeUInt32LE(0x46546C67, offset); offset += 4;
        glbBuffer.writeUInt32LE(2, offset); offset += 4;
        glbBuffer.writeUInt32LE(totalLength, offset); offset += 4;
        
        glbBuffer.writeUInt32LE(jsonLength, offset); offset += 4;
        glbBuffer.writeUInt32LE(0x4E4F534A, offset); offset += 4;
        jsonBuffer.copy(glbBuffer, offset);
        for (let i = 0; i < jsonPadding; i++) {
            glbBuffer[offset + jsonBuffer.length + i] = 0x20;
        }
        offset += jsonLength;
        
        if (binaryBuffer.length > 0) {
            glbBuffer.writeUInt32LE(binaryLength, offset); offset += 4;
            glbBuffer.writeUInt32LE(0x004E4942, offset); offset += 4;
            
            for (let i = 0; i < binaryBuffer.length; i++) {
                glbBuffer.writeFloatLE(binaryBuffer[i], offset);
                offset += 4;
            }
        }
        
        if (typeof stream === 'string') {
            fs.writeFileSync(stream, glbBuffer);
        } else if (stream && typeof stream.write === 'function') {
            stream.write(glbBuffer);
            if (stream.close) {
                stream.close();
            }
        }
    }

    private _arrayToBase64(data: number[]): string {
        const buffer = Buffer.alloc(data.length * 4);
        for (let i = 0; i < data.length; i++) {
            buffer.writeFloatLE(data[i], i * 4);
        }
        return buffer.toString('base64');
    }
}
