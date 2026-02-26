import { Importer } from '../Importer';
import { Scene } from '../../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../../FileFormat';
import { ThreeMfLoadOptions } from './ThreeMfLoadOptions';
import { ThreeMfFormat } from './ThreeMfFormat';

import { Vector4 } from '../../utilities/Vector4';
import { FVector4 } from '../../utilities/FVector4';
import { Vector3 } from '../../utilities/Vector3';
import { Matrix4 } from '../../utilities/Matrix4';
import { MappingMode } from '../../entities/MappingMode';
import { ReferenceMode } from '../../entities/ReferenceMode';
import { VertexElementVertexColor } from '../../entities/VertexElementVertexColor';
import { LambertMaterial } from '../../shading/LambertMaterial';
import { Mesh } from '../../entities/Mesh';
import { Node } from '../../Node';

import * as fs from 'fs';

export class ThreeMfImporter extends Importer {
    private _materialMap: Map<string, string> = new Map();

    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ThreeMfFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        let threeMfOptions: ThreeMfLoadOptions;
        if (!(options instanceof ThreeMfLoadOptions)) {
            threeMfOptions = new ThreeMfLoadOptions();
        } else {
            threeMfOptions = options as ThreeMfLoadOptions;
        }

        let buffer: Buffer;
        if (Buffer.isBuffer(stream)) {
            buffer = stream;
        } else if (stream && typeof stream.read === 'function') {
            buffer = Buffer.from(stream.read());
        } else if (typeof stream === 'string') {
            buffer = fs.readFileSync(stream);
        } else {
            throw new TypeError('Stream must be a buffer, file path, or stream with read() method');
        }

        let zipFile: any;
        try {
            const AdmZip = require('adm-zip');
            zipFile = new AdmZip(buffer);
        } catch (e: any) {
            throw new Error(`Failed to open 3MF file: ${e.message}`);
        }

        const modelContent = this._findModelContent(zipFile);
        if (modelContent === null) {
            throw new Error('No 3D model found in 3MF file');
        }

        const xmlContent = modelContent.toString();
        const root = this._parseXML(xmlContent);

        const modelUnit = root.getAttribute('unit') || 'millimeter';
        const scaleFactor = this._getUnitScale(modelUnit);

        let ns: string | null = null;
        if (root.tagName.includes('}')) {
            ns = root.tagName.split('}')[0] + '}';
        }

        const nsDict = ns ? { m: ns } : {};

        const resources: any = {};
        const verticesMap: Map<string, Vector4[]> = new Map();
        const trianglesMap: Map<string, any[]> = new Map();
        const objectMaterials: Map<string, string> = new Map();
        const triangleMaterials: Map<string, any> = new Map();

        const resourcesElem = this._findElement(root, 'resources', nsDict);
        if (resourcesElem) {
            this._parseResources(resourcesElem, resources, verticesMap, trianglesMap, objectMaterials, triangleMaterials, threeMfOptions, scaleFactor, nsDict);
        }

        const buildElem = this._findElement(root, 'build', nsDict);
        if (buildElem) {
            this._parseBuild(buildElem, scene, resources, verticesMap, trianglesMap, objectMaterials, triangleMaterials, threeMfOptions, nsDict);
        }
    }

    private _findModelContent(zipFile: any): Buffer | null {
        const entries = zipFile.getEntries();
        for (const entry of entries) {
            const entryName = entry.entryName;
            if (entryName.endsWith('.model') || entryName.toLowerCase().includes('3dmodel.model')) {
                try {
                    return entry.getData();
                } catch {
                    continue;
                }
            }
        }
        return null;
    }

    private _getUnitScale(unit: string): number {
        const scales: { [key: string]: number } = {
            'micron': 0.000001,
            'millimeter': 0.001,
            'centimeter': 0.01,
            'meter': 1.0,
            'inch': 0.0254,
            'foot': 0.3048
        };
        return scales[unit.toLowerCase()] || 0.001;
    }

    private _parseResources(resourcesElem: any, resources: any, verticesMap: Map<string, Vector4[]>, trianglesMap: Map<string, any[]>, objectMaterials: Map<string, string>, _triangleMaterials: Map<string, any>, options: ThreeMfLoadOptions, scale: number, nsDict: any): void {
        const ns = nsDict.m || '';

        const colorMap: Map<string, string> = new Map();
        const materialMap: Map<string, string> = new Map();

        const colorElems = this._findAllElements(resourcesElem, 'color', ns);
        for (const colorElem of colorElems) {
            const colorId = colorElem.getAttribute('id');
            const colorValue = colorElem.getAttribute('value');
            if (colorId && colorValue) {
                colorMap.set(colorId, colorValue);
            }
        }

        const materialElems = this._findAllElements(resourcesElem, 'material', ns);
        for (const materialElem of materialElems) {
            const materialId = materialElem.getAttribute('id');
            const colorId = materialElem.getAttribute('colorid');
            if (materialId && colorId && colorMap.has(colorId)) {
                materialMap.set(materialId, colorMap.get(colorId)!);
            }
        }

        for (const [colorId, colorValue] of colorMap) {
            if (!materialMap.has(colorId)) {
                materialMap.set(colorId, colorValue);
            }
        }

        this._materialMap = materialMap;

        const objElems = this._findAllElements(resourcesElem, 'object', ns);
        for (const objElem of objElems) {
            const objId = objElem.getAttribute('id');
            const objName = objElem.getAttribute('name') || `object_${objId}`;
            const objMaterialId = objElem.getAttribute('materialid');

            const meshElem = this._findElement(objElem, 'mesh', ns);

            if (meshElem) {
                const vertices: Vector4[] = [];
                const triangles: any[] = [];

                const vertsElem = this._findElement(meshElem, 'vertices', ns);
                if (vertsElem) {
                    const vertElems = this._findAllElements(vertsElem, 'vertex', ns);
                    for (const vertElem of vertElems) {
                        const x = parseFloat(vertElem.getAttribute('x') || '0') * scale;
                        const y = parseFloat(vertElem.getAttribute('y') || '0') * scale;
                        const z = parseFloat(vertElem.getAttribute('z') || '0') * scale;

                        let yPos = y;
                        let zPos = z;
                        if (options.flipCoordinateSystem) {
                            yPos = z;
                            zPos = y;
                        }

                        vertices.push(new Vector4(x, yPos, zPos, 1.0));
                    }
                }

                const trisElem = this._findElement(meshElem, 'triangles', ns);
                if (trisElem) {
                    const triElems = this._findAllElements(trisElem, 'triangle', ns);
                    for (const triElem of triElems) {
                        const v1 = parseInt(triElem.getAttribute('v1') || '0');
                        const v2 = parseInt(triElem.getAttribute('v2') || '0');
                        const v3 = parseInt(triElem.getAttribute('v3') || '0');
                        const triMaterialId = triElem.getAttribute('materialid');
                        triangles.push([v1, v2, v3, triMaterialId || null]);
                    }
                }

                verticesMap.set(objId, vertices);
                trianglesMap.set(objId, triangles);
                resources[objId] = { name: objName, type: 'mesh' };
                if (objMaterialId) {
                    objectMaterials.set(objId, objMaterialId);
                }
            }

            const compElems = this._findAllElements(objElem, 'components/component', ns);
            if (compElems.length > 0) {
                resources[objId] = { name: objName, type: 'components', components: [] };
                for (const compElem of compElems) {
                    const compId = compElem.getAttribute('objectid');
                    const transformStr = compElem.getAttribute('transform') || '';
                    const transform = this._parseTransform(transformStr);
                    resources[objId].components.push([compId, transform]);
                }
            }
        }
    }

    private _parseTransform(transformStr: string): Matrix4 | null {
        if (!transformStr) {
            return null;
        }

        try {
            const values = transformStr.split(/\s+/).map(parseFloat);
            if (values.length === 12) {
                return new Matrix4(
                    values[0], values[1], values[2], 0,
                    values[3], values[4], values[5], 0,
                    values[6], values[7], values[8], 0,
                    values[9], values[10], values[11], 1
                );
            }
        } catch {
            return null;
        }

        return null;
    }

    private _parseBuild(buildElem: any, scene: Scene, resources: any, verticesMap: Map<string, Vector4[]>, trianglesMap: Map<string, any[]>, objectMaterials: Map<string, string>, _triangleMaterials: Map<string, any>, _options: ThreeMfLoadOptions, nsDict: any): void {
        const ns = nsDict.m || '';

        const itemElems = this._findAllElements(buildElem, 'item', ns);
        for (const itemElem of itemElems) {
            const objId = itemElem.getAttribute('objectid');
            const itemName = (resources[objId] && resources[objId].name) || `item_${objId}`;

            const transformStr = itemElem.getAttribute('transform') || '';
            const transform = this._parseTransform(transformStr);

            if (resources[objId] && resources[objId].type === 'mesh') {
                this._createMeshNode(scene, objId, itemName, transform, verticesMap, trianglesMap, objectMaterials, _triangleMaterials);
            }
        }
    }

    private _createMeshNode(scene: Scene, objId: string, name: string, transform: Matrix4 | null, verticesMap: Map<string, Vector4[]>, trianglesMap: Map<string, any[]>, objectMaterials: Map<string, string>, _triangleMaterials: Map<string, any>): void {
        if (!verticesMap.has(objId) || !trianglesMap.has(objId)) {
            return;
        }

        const vertices = verticesMap.get(objId)!;
        const triangles = trianglesMap.get(objId)!;

        const mesh = new Mesh(name);

        for (const v of vertices) {
            mesh.controlPoints.push(v);
        }

        for (const tri of triangles) {
            if (tri.length === 3) {
                mesh.createPolygon(tri[0], tri[1], tri[2]);
            } else if (tri.length === 4) {
                mesh.createPolygon(tri[0], tri[1], tri[2], tri[3]);
            } else if (tri.length >= 3) {
                const indices: number[] = [];
                for (let i = 0; i < 3; i++) {
                    indices.push(tri[i]);
                }
                mesh.createPolygon(indices);
            }
        }

        const node = new Node(name);
        node.entity = mesh;
        node.parentNode = scene.rootNode;

        if (transform) {
            node.transform.transformMatrix = transform;
        }

        if (objectMaterials.has(objId)) {
            this._applyObjectMaterial(node, objectMaterials.get(objId)!);
        } else {
            const triMaterialIds = new Set<string>();
            for (const tri of triangles) {
                if (tri.length > 3 && tri[3] !== null) {
                    triMaterialIds.add(tri[3]);
                }
            }

            if (triMaterialIds.size === 1) {
                const singleMaterialId = triMaterialIds.values().next().value;
                if (singleMaterialId !== undefined) {
                    this._applyObjectMaterial(node, singleMaterialId);
                }
            }
        }

        this._applyTriangleMaterials(mesh, vertices, triangles);
    }

    private _applyObjectMaterial(node: Node, materialId: string): void {
        const material = new LambertMaterial(`material_${materialId}`);
        const hexColor = this._materialMap.get(materialId) || null;
        const color = this._parseColor(hexColor);
        if (color) {
            material.diffuseColor = color;
        }
        node.material = material;
    }

    private _applyTriangleMaterials(mesh: Mesh, _vertices: Vector4[], triangles: any[], _triangleMaterials?: Map<string, any>): void {
        const triangleMaterialIds = new Set<string>();
        for (const tri of triangles) {
            if (tri.length > 3 && tri[3] !== null) {
                triangleMaterialIds.add(tri[3]);
            }
        }

        if (triangleMaterialIds.size <= 1) {
            return;
        }

        const triangleColors: Map<string, Vector3> = new Map();
        for (const matId of triangleMaterialIds) {
            const hexColor = this._materialMap.get(matId) || null;
            const color = this._parseColor(hexColor);
            if (color) {
                triangleColors.set(matId, color);
            }
        }

        const vertexColorElement = new VertexElementVertexColor();
        vertexColorElement.mappingMode = MappingMode.POLYGON;
        vertexColorElement.referenceMode = ReferenceMode.INDEX_TO_DIRECT;

        const vertexColors: FVector4[] = [];
        for (const tri of triangles) {
            if (tri.length > 3 && tri[3] !== null && triangleColors.has(tri[3])) {
                const color = triangleColors.get(tri[3])!;
                vertexColors.push(new FVector4(color.x, color.y, color.z, 1.0));
            } else {
                vertexColors.push(new FVector4(1.0, 1.0, 1.0, 1.0));
            }
        }

        vertexColorElement.setData(vertexColors);
        mesh.vertexElements.push(vertexColorElement);
    }

    private _parseColor(materialId: string | null): Vector3 | null {
        if (!materialId || !materialId.startsWith('#')) {
            return null;
        }

        let hexColor = materialId;
        if (hexColor.startsWith('#')) {
            hexColor = hexColor.substring(1);
        }

        if (hexColor.length === 6) {
            const r = parseInt(hexColor.substring(0, 2), 16) / 255.0;
            const g = parseInt(hexColor.substring(2, 4), 16) / 255.0;
            const b = parseInt(hexColor.substring(4, 6), 16) / 255.0;
            return new Vector3(r, g, b);
        } else if (hexColor.length === 8) {
            const r = parseInt(hexColor.substring(0, 2), 16) / 255.0;
            const g = parseInt(hexColor.substring(2, 4), 16) / 255.0;
            const b = parseInt(hexColor.substring(4, 6), 16) / 255.0;
            return new Vector3(r, g, b);
        }

        return null;
    }

    private _parseXML(xmlString: string): any {
        const DOMParser = require('xmldom').DOMParser;
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, 'text/xml').documentElement;
    }

    private _findElement(parent: any, tagName: string, nsDict: any): any {
        const ns = nsDict.m || '';
        const fullName = ns ? `${ns}${tagName}` : tagName;
        const elem = parent.getElementsByTagName(fullName);
        if (elem && elem.length > 0) {
            return elem[0];
        }
        return null;
    }

    private _findAllElements(parent: any, tagName: string, nsDict: any): any[] {
        const ns = nsDict.m || '';
        const fullName = ns ? `${ns}${tagName}` : tagName;
        return Array.from(parent.getElementsByTagName(fullName));
    }
}
