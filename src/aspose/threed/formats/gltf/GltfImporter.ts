import { Importer } from '../Importer';
import { Scene } from '../../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../../FileFormat';
import { GltfFormat } from './GltfFormat';
import { GltfLoadOptions } from './GltfLoadOptions';
import { Mesh } from '../../entities/Mesh';
import { Node } from '../../Node';
import { Vector4 } from '../../utilities/Vector4';
import { FVector3 } from '../../utilities/FVector3';
import { FVector2 } from '../../utilities/FVector2';
import { VertexElementNormal } from '../../entities/VertexElementNormal';
import { VertexElementUV } from '../../entities/VertexElementUV';
import { PbrMaterial } from '../../shading/PbrMaterial';
import { MappingMode } from '../../entities/MappingMode';
import { ReferenceMode } from '../../entities/ReferenceMode';

interface GltfData {
    asset: { version: string; generator?: string };
    scene?: number;
    scenes?: { nodes: number[] }[];
    nodes?: { name?: string; mesh?: number; children?: number[]; translation?: number[]; rotation?: number[]; scale?: number[]; matrix?: number[] }[];
    meshes?: { name?: string; primitives: { attributes: { [key: string]: number }; indices?: number; material?: number; mode?: number }[] }[];
    accessors?: { bufferView?: number; componentType: number; count: number; type: string; min?: number[]; max?: number[] }[];
    bufferViews?: { buffer: number; byteOffset?: number; byteLength: number; byteStride?: number }[];
    buffers?: { byteLength: number; uri?: string }[];
    materials?: { name?: string; pbrMetallicRoughness?: { baseColorFactor?: number[]; metallicFactor?: number; roughnessFactor?: number }; emissiveFactor?: number[]; alphaMode?: string; alphaCutoff?: number }[];
}

export class GltfImporter extends Importer {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof GltfFormat;
    }

    importScene(scene: Scene, stream: Buffer | Uint8Array, options: LoadOptions): void {
        const gltfOptions = options instanceof GltfLoadOptions ? options : new GltfLoadOptions();
        const buffer = stream instanceof Buffer ? stream : Buffer.from(stream);
        
        let gltfData: GltfData;
        let binaryBuffer: Buffer | null = null;
        
        if (this._isGlb(buffer)) {
            const parsed = this._parseGlb(buffer);
            gltfData = parsed.json;
            binaryBuffer = parsed.binary;
        } else {
            gltfData = JSON.parse(buffer.toString('utf-8'));
        }
        
        const buffers = this._loadBuffers(gltfData, binaryBuffer);
        const meshes = this._createMeshes(gltfData, buffers, gltfOptions);
        const materials = this._createMaterials(gltfData);
        
        this._createNodes(scene, gltfData, meshes, materials);
    }

    private _isGlb(buffer: Buffer): boolean {
        if (buffer.length < 12) return false;
        const magic = buffer.readUInt32LE(0);
        return magic === 0x46546C67;
    }

    private _parseGlb(buffer: Buffer): { json: GltfData; binary: Buffer | null } {
        const magic = buffer.readUInt32LE(0);
        if (magic !== 0x46546C67) {
            throw new Error('Invalid GLB file');
        }
        
        const version = buffer.readUInt32LE(4);
        if (version !== 2) {
            throw new Error(`Unsupported GLB version: ${version}`);
        }
        
        let offset = 12;
        let json: GltfData | null = null;
        let binary: Buffer | null = null;
        
        while (offset < buffer.length) {
            const chunkLength = buffer.readUInt32LE(offset);
            const chunkType = buffer.readUInt32LE(offset + 4);
            const chunkData = buffer.slice(offset + 8, offset + 8 + chunkLength);
            
            if (chunkType === 0x4E4F534A) {
                json = JSON.parse(chunkData.toString('utf-8'));
            } else if (chunkType === 0x004E4942) {
                binary = chunkData;
            }
            
            offset += 8 + chunkLength;
        }
        
        if (!json) {
            throw new Error('GLB file missing JSON chunk');
        }
        
        return { json, binary };
    }

    private _loadBuffers(gltfData: GltfData, binaryBuffer: Buffer | null): Buffer[] {
        const buffers: Buffer[] = [];
        
        if (!gltfData.buffers) return buffers;
        
        for (const bufferDef of gltfData.buffers) {
            if (bufferDef.uri) {
                if (bufferDef.uri.startsWith('data:application/octet-stream;base64,')) {
                    const base64Data = bufferDef.uri.substring('data:application/octet-stream;base64,'.length);
                    buffers.push(Buffer.from(base64Data, 'base64'));
                } else if (bufferDef.uri.startsWith('data:application/gltf-buffer;base64,')) {
                    const base64Data = bufferDef.uri.substring('data:application/gltf-buffer;base64,'.length);
                    buffers.push(Buffer.from(base64Data, 'base64'));
                } else {
                    buffers.push(Buffer.alloc(bufferDef.byteLength));
                }
            } else if (binaryBuffer) {
                buffers.push(binaryBuffer);
            } else {
                buffers.push(Buffer.alloc(bufferDef.byteLength));
            }
        }
        
        return buffers;
    }

    private _createMeshes(gltfData: GltfData, buffers: Buffer[], options: GltfLoadOptions): Mesh[] {
        const meshes: Mesh[] = [];
        
        if (!gltfData.meshes) return meshes;
        
        for (const meshDef of gltfData.meshes) {
            const mesh = new Mesh(meshDef.name || `mesh_${meshes.length}`);
            
            for (const primitive of meshDef.primitives) {
                const positions = this._readAccessor(gltfData, buffers, primitive.attributes['POSITION']);
                if (positions) {
                    for (let i = 0; i < positions.length; i += 3) {
                        mesh.addControlPoint(new Vector4(positions[i], positions[i + 1], positions[i + 2], 1.0));
                    }
                }
                
                if (primitive.attributes['NORMAL']) {
                    const normals = this._readAccessor(gltfData, buffers, primitive.attributes['NORMAL']);
                    if (normals) {
                        const normalElement = new VertexElementNormal('', MappingMode.CONTROL_POINT, ReferenceMode.DIRECT);
                        const normalData: FVector3[] = [];
                        for (let i = 0; i < normals.length; i += 3) {
                            normalData.push(new FVector3(normals[i], normals[i + 1], normals[i + 2]));
                        }
                        normalElement.setData(normalData);
                        mesh.addElement(normalElement);
                    }
                }
                
                if (primitive.attributes['TEXCOORD_0']) {
                    const uvs = this._readAccessor(gltfData, buffers, primitive.attributes['TEXCOORD_0']);
                    if (uvs) {
                        const uvElement = new VertexElementUV(null, '', MappingMode.CONTROL_POINT, ReferenceMode.DIRECT);
                        const uvData: FVector2[] = [];
                        for (let i = 0; i < uvs.length; i += 2) {
                            let v = uvs[i + 1];
                            if (options.flipTexCoordV) {
                                v = 1.0 - v;
                            }
                            uvData.push(new FVector2(uvs[i], v));
                        }
                        uvElement.addData(uvData);
                        mesh.addElement(uvElement);
                    }
                }
                
                if (primitive.indices !== undefined) {
                    const indices = this._readIndices(gltfData, buffers, primitive.indices);
                    if (indices) {
                        for (let i = 0; i < indices.length; i += 3) {
                            mesh.createPolygon(indices[i], indices[i + 1], indices[i + 2]);
                        }
                    }
                } else {
                    const vertexCount = positions ? positions.length / 3 : 0;
                    for (let i = 0; i < vertexCount; i += 3) {
                        mesh.createPolygon(i, i + 1, i + 2);
                    }
                }
            }
            
            meshes.push(mesh);
        }
        
        return meshes;
    }

    private _createMaterials(gltfData: GltfData): (PbrMaterial | null)[] {
        const materials: (PbrMaterial | null)[] = [];
        
        if (!gltfData.materials) return materials;
        
        for (const matDef of gltfData.materials) {
            const material = new PbrMaterial(matDef.name || `material_${materials.length}`);
            
            if (matDef.pbrMetallicRoughness) {
                const pbr = matDef.pbrMetallicRoughness;
                if (pbr.baseColorFactor && pbr.baseColorFactor.length >= 3) {
                    material.albedo = new (require('../../utilities/Vector3').Vector3)(pbr.baseColorFactor[0], pbr.baseColorFactor[1], pbr.baseColorFactor[2]);
                }
                material.metallicFactor = pbr.metallicFactor ?? 0.0;
                material.roughnessFactor = pbr.roughnessFactor ?? 1.0;
            }
            
            if (matDef.emissiveFactor && matDef.emissiveFactor.length >= 3) {
                material.emissiveColor = new (require('../../utilities/Vector3').Vector3)(matDef.emissiveFactor[0], matDef.emissiveFactor[1], matDef.emissiveFactor[2]);
            }
            
            if (matDef.alphaMode === 'BLEND') {
                material.transparency = 1.0;
            } else if (matDef.alphaMode === 'MASK') {
                material.transparency = 0.5;
            }
            
            materials.push(material);
        }
        
        return materials;
    }

    private _createNodes(scene: Scene, gltfData: GltfData, meshes: Mesh[], materials: (PbrMaterial | null)[]): void {
        const nodes: (Node | null)[] = [];
        
        if (!gltfData.nodes) return;
        
        for (const nodeDef of gltfData.nodes) {
            const node = new Node(nodeDef.name || `node_${nodes.length}`);
            
            if (nodeDef.mesh !== undefined && meshes[nodeDef.mesh]) {
                node.entity = meshes[nodeDef.mesh];
                
                if (gltfData.meshes && gltfData.meshes[nodeDef.mesh]) {
                    const meshDef = gltfData.meshes[nodeDef.mesh];
                    if (meshDef.primitives && meshDef.primitives.length > 0 && meshDef.primitives[0].material !== undefined) {
                        const matIdx = meshDef.primitives[0].material;
                        if (materials[matIdx]) {
                            node.material = materials[matIdx];
                        }
                    }
                }
            }
            
            nodes.push(node);
        }
        
        const sceneIndex = gltfData.scene ?? 0;
        if (gltfData.scenes && gltfData.scenes[sceneIndex]) {
            const rootNodes = gltfData.scenes[sceneIndex].nodes;
            if (rootNodes) {
                for (const nodeIdx of rootNodes) {
                    if (nodes[nodeIdx]) {
                        scene.rootNode.addChildNode(nodes[nodeIdx]!);
                        this._addChildren(nodes[nodeIdx]!, nodeIdx, gltfData, nodes);
                    }
                }
            }
        }
    }

    private _addChildren(parentNode: Node, nodeIndex: number, gltfData: GltfData, nodes: (Node | null)[]): void {
        if (!gltfData.nodes || !gltfData.nodes[nodeIndex] || !gltfData.nodes[nodeIndex].children) return;
        
        for (const childIdx of gltfData.nodes[nodeIndex].children!) {
            if (nodes[childIdx]) {
                parentNode.addChildNode(nodes[childIdx]!);
                this._addChildren(nodes[childIdx]!, childIdx, gltfData, nodes);
            }
        }
    }

    private _readAccessor(gltfData: GltfData, buffers: Buffer[], accessorIndex: number): Float32Array | null {
        if (!gltfData.accessors || !gltfData.accessors[accessorIndex]) return null;
        
        const accessor = gltfData.accessors[accessorIndex];
        if (accessor.bufferView === undefined) return null;
        
        const bufferView = gltfData.bufferViews?.[accessor.bufferView];
        if (!bufferView) return null;
        
        const buffer = buffers[bufferView.buffer];
        if (!buffer) return null;
        
        const byteOffset = bufferView.byteOffset ?? 0;
        const componentSize = this._getComponentSize(accessor.componentType);
        const numComponents = this._getNumComponents(accessor.type);
        const byteStride = bufferView.byteStride ?? (componentSize * numComponents);
        
        const data = new Float32Array(accessor.count * numComponents);
        
        for (let i = 0; i < accessor.count; i++) {
            const elementOffset = byteOffset + i * byteStride;
            for (let j = 0; j < numComponents; j++) {
                const value = this._readComponent(buffer, elementOffset + j * componentSize, accessor.componentType);
                data[i * numComponents + j] = value;
            }
        }
        
        return data;
    }

    private _readIndices(gltfData: GltfData, buffers: Buffer[], accessorIndex: number): Uint32Array | null {
        if (!gltfData.accessors || !gltfData.accessors[accessorIndex]) return null;
        
        const accessor = gltfData.accessors[accessorIndex];
        if (accessor.bufferView === undefined) return null;
        
        const bufferView = gltfData.bufferViews?.[accessor.bufferView];
        if (!bufferView) return null;
        
        const buffer = buffers[bufferView.buffer];
        if (!buffer) return null;
        
        const byteOffset = bufferView.byteOffset ?? 0;
        const componentSize = this._getComponentSize(accessor.componentType);
        
        const indices = new Uint32Array(accessor.count);
        
        for (let i = 0; i < accessor.count; i++) {
            indices[i] = this._readComponentAsInt(buffer, byteOffset + i * componentSize, accessor.componentType);
        }
        
        return indices;
    }

    private _getComponentSize(componentType: number): number {
        switch (componentType) {
            case 5120: return 1;
            case 5121: return 1;
            case 5122: return 2;
            case 5123: return 2;
            case 5125: return 4;
            case 5126: return 4;
            default: return 4;
        }
    }

    private _getNumComponents(type: string): number {
        switch (type) {
            case 'SCALAR': return 1;
            case 'VEC2': return 2;
            case 'VEC3': return 3;
            case 'VEC4': return 4;
            case 'MAT2': return 4;
            case 'MAT3': return 9;
            case 'MAT4': return 16;
            default: return 1;
        }
    }

    private _readComponent(buffer: Buffer, offset: number, componentType: number): number {
        switch (componentType) {
            case 5120: return buffer.readInt8(offset);
            case 5121: return buffer.readUInt8(offset);
            case 5122: return buffer.readInt16LE(offset);
            case 5123: return buffer.readUInt16LE(offset);
            case 5125: return buffer.readUInt32LE(offset);
            case 5126: return buffer.readFloatLE(offset);
            default: return 0;
        }
    }

    private _readComponentAsInt(buffer: Buffer, offset: number, componentType: number): number {
        switch (componentType) {
            case 5120: return buffer.readInt8(offset);
            case 5121: return buffer.readUInt8(offset);
            case 5122: return buffer.readInt16LE(offset);
            case 5123: return buffer.readUInt16LE(offset);
            case 5125: return buffer.readUInt32LE(offset);
            case 5126: return Math.round(buffer.readFloatLE(offset));
            default: return 0;
        }
    }
}
