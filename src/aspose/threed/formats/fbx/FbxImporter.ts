import { Importer } from '../Importer';
import { LoadOptions } from '../LoadOptions';
import { Scene } from '../../Scene';
import { FileFormat } from '../../FileFormat';
import { FbxFormat } from './FbxFormat';
import { FbxParser } from './parser';
import { FbxTokenizer } from './tokenizer';
import { BinaryTokenizer } from './binary_tokenizer';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';
import { Vector4 } from '../../utilities/Vector4';
import { LambertMaterial } from '../../shading/LambertMaterial';
import { VertexElementType } from '../../entities/VertexElementType';
import { TextureMapping } from '../../entities/TextureMapping';
import { MappingMode } from '../../entities/MappingMode';
import { Material } from '../../shading/Material';

export class FbxImporter extends Importer {
    private _objectMap: { [key: number]: any } = {};

    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof FbxFormat;
    }

    open(filename: string, options?: LoadOptions): Scene {
        if (!options) {
            const { FbxLoadOptions } = require('./FbxLoadOptions');
            options = new FbxLoadOptions();
        }

        const tokens = this._getTokensFromFile(filename);
        const parser = new FbxParser(tokens);
        const scene = new Scene();

        this._parseScene(parser.rootScope, scene);

        return scene;
    }

    openFromStream(stream: any, options?: LoadOptions): Scene {
        if (!options) {
            const { FbxLoadOptions } = require('./FbxLoadOptions');
            options = new FbxLoadOptions();
        }

        const tokens = this._getTokensFromStream(stream);
        const parser = new FbxParser(tokens);
        const scene = new Scene();

        this._parseScene(parser.rootScope, scene);

        return scene;
    }

    importScene(scene: Scene, stream: any, _options: LoadOptions): void {
        const tokens = this._getTokensFromStream(stream);
        const parser = new FbxParser(tokens);

        this._parseScene(parser.rootScope, scene);
    }

    private _getTokensFromFile(filename: string): any[] {
        const fs = require('fs');
        const data = fs.readFileSync(filename);

        if (this._isBinaryFile(data)) {
            const tokenizer = new BinaryTokenizer(data);
            return tokenizer.tokenize();
        } else {
            const content = data.toString('utf-8');
            const tokenizer = new FbxTokenizer(content);
            return tokenizer.tokenize();
        }
    }

    private _getTokensFromStream(stream: any): any[] {
        const content = stream.read();

        if (content instanceof Buffer) {
            if (this._isBinaryFile(content)) {
                const tokenizer = new BinaryTokenizer(content);
                return tokenizer.tokenize();
            } else {
                const contentStr = content.toString('utf-8');
                const tokenizer = new FbxTokenizer(contentStr);
                return tokenizer.tokenize();
            }
        } else {
            const tokenizer = new FbxTokenizer(content);
            return tokenizer.tokenize();
        }
    }

    private _isBinaryFile(data: Buffer | string): boolean {
        if (typeof data === 'string') {
            return false;
        }
        if (data.length < 18) {
            return false;
        }
        return data.toString('utf-8', 0, 18) === 'Kaydara FBX Binary';
    }

    private _parseScene(rootScope: any, scene: Scene): void {
        const objectsElement = rootScope.getFirstElement('Objects');
        if (!objectsElement || !objectsElement.compound) {
            return;
        }

        const objectsScope = objectsElement.compound;
        this._objectMap = {};

        const geometryElements = objectsScope.getElements('Geometry');
        const modelElements = objectsScope.getElements('Model');
        const materialElements = objectsScope.getElements('Material');

        this._parseGeometries(geometryElements);
        this._parseModels(modelElements);
        this._parseMaterials(materialElements);
        this._parseConnections(rootScope, scene);
    }

    private _parseGeometries(geometryElements: any[]): void {
        for (const geomElem of geometryElements) {
            const geomScope = geomElem.compound;
            if (!geomScope) {
                continue;
            }

            const geomId = this._parseId(geomElem.tokens[0].text);
            if (geomId === null) {
                continue;
            }

            const mesh = new Mesh();
            this._objectMap[geomId] = mesh;

            const verticesElement = geomScope.getFirstElement('Vertices');
            if (verticesElement && verticesElement.compound) {
                const aElem = verticesElement.compound.getFirstElement('a');
                if (aElem) {
                    const vertices = this._parseFloatArray(aElem.tokens[0].text);
                    for (let i = 0; i < vertices.length; i += 3) {
                        if (i + 2 < vertices.length) {
                            mesh.controlPoints.push(new Vector4(vertices[i], vertices[i + 1], vertices[i + 2], 1.0));
                        }
                    }
                }
            }

            const polygonElement = geomScope.getFirstElement('PolygonVertexIndex');
            if (polygonElement && polygonElement.compound) {
                const aElem = polygonElement.compound.getFirstElement('a');
                if (aElem) {
                    const indices = this._parseIntArray(aElem.tokens[0].text);
                    for (const idx of indices) {
                        if (idx < 0) {
                            mesh.polygons.push([Math.abs(idx) - 1]);
                            mesh.polygons.push([0xFFFFFFFF]);
                        } else {
                            mesh.polygons.push([idx]);
                        }
                    }
                }
            }

            const normalElement = geomScope.getFirstElement('Normals');
            if (normalElement && normalElement.compound) {
                const aElem = normalElement.compound.getFirstElement('a');
                if (aElem) {
                    const normals = this._parseFloatArray(aElem.tokens[0].text);
                    const FVector4 = require('../../utilities/FVector4').FVector4;
                    const vertexElement = mesh.createElement(VertexElementType.NORMAL) as any;
                    vertexElement.mappingMode = MappingMode.CONTROL_POINT;
                    const normalData: any[] = [];
                    for (let i = 0; i < normals.length; i += 3) {
                        if (i + 2 < normals.length) {
                            normalData.push(new FVector4(normals[i], normals[i + 1], normals[i + 2], 0.0));
                        }
                    }
                    vertexElement.setData(normalData);
                }
            }

            const uvElement = geomScope.getFirstElement('UV');
            if (uvElement && uvElement.compound) {
                const aElem = uvElement.compound.getFirstElement('a');
                if (aElem) {
                    const uvs = this._parseFloatArray(aElem.tokens[0].text);
                    const FVector2 = require('../../utilities/FVector2').FVector2;
                    const vertexElement = mesh.createElementUV(TextureMapping.DIFFUSE);
                    vertexElement.mappingMode = MappingMode.CONTROL_POINT;
                    const uvData: any[] = [];
                    for (let i = 0; i < uvs.length; i += 2) {
                        if (i + 1 < uvs.length) {
                            uvData.push(new FVector2(uvs[i], uvs[i + 1]));
                        }
                    }
                    vertexElement.setData(uvData);
                }
            }
        }
    }

    private _parseModels(modelElements: any[]): void {
        for (const modelElem of modelElements) {
            const modelId = this._parseId(modelElem.tokens[0].text);
            if (modelId === null) {
                continue;
            }

            const node = new Node();
            this._objectMap[modelId] = node;

            if (modelElem.tokens.length > 1) {
                const tokenValue = modelElem.tokens[1].text;
                if (typeof tokenValue === 'string') {
                    node.name = tokenValue.replace(/"/g, '');
                }
            }
        }
    }

    private _parseMaterials(materialElements: any[]): void {
        for (const matElem of materialElements) {
            const matId = this._parseId(matElem.tokens[0].text);
            if (matId === null) {
                continue;
            }

            const material = new LambertMaterial();
            this._objectMap[matId] = material;

            if (matElem.tokens.length > 1) {
                const tokenValue = matElem.tokens[1].text;
                if (typeof tokenValue === 'string') {
                    material.name = tokenValue.replace(/"/g, '');
                }
            }

            const matScope = matElem.compound;
            if (!matScope) {
                continue;
            }
        }
    }

    private _parseConnections(rootScope: any, scene: Scene): void {
        const connectionsElement = rootScope.getFirstElement('Connections');
        if (!connectionsElement || !connectionsElement.compound) {
            return;
        }

        const connectionsScope = connectionsElement.compound;
        const connectionElements = connectionsScope.getElements('C');

        for (const connElem of connectionElements) {
            if (connElem.tokens.length < 3) {
                continue;
            }

            const connType = connElem.tokens[0].text;
            if (typeof connType !== 'string') {
                continue;
            }
            connType.replace(/"/g, '');

            if (connType === 'OO') {
                const childId = this._parseId(connElem.tokens[1].text);
                const parentId = this._parseId(connElem.tokens[2].text);

                this._connectObjects(childId, parentId, scene);
            }
        }
    }

    private _connectObjects(childId: number | null, parentId: number | null, scene: Scene): void {
        if (childId === null) {
            return;
        }

        const childObj = this._objectMap[childId];
        if (!childObj) {
            return;
        }

        let parentObj: any;
        if (parentId === 0) {
            parentObj = scene.rootNode;
        } else {
            if (parentId === null) {
                return;
            }
            parentObj = this._objectMap[parentId];
            if (!parentObj) {
                return;
            }
        }

        if (childObj instanceof Mesh && parentObj instanceof Node) {
            parentObj.entities.push(childObj);
        } else if (childObj instanceof Material && parentObj instanceof Node) {
            parentObj.materials.push(childObj);
        } else if (childObj instanceof Node && parentObj instanceof Node) {
            parentObj.childNodes.push(childObj);
        }
    }

    private _parseId(value: any): number | null {
        try {
            if (typeof value === 'number') {
                return value;
            }
            if (typeof value === 'string') {
                return parseInt(value);
            }
            if (value instanceof Buffer) {
                return parseInt(value.toString('utf-8'));
            }
            return parseInt(value);
        } catch {
            return null;
        }
    }

    private _parseIntArray(value: any): number[] {
        if (Array.isArray(value)) {
            return value;
        }
        const text = String(value);
        const cleanedText = text.startsWith('a:') ? text.substring(2) : text;
        const values = cleanedText.match(/-?\d+/g);
        return values ? values.map(Number) : [];
    }

    private _parseFloatArray(value: any): number[] {
        if (Array.isArray(value)) {
            return value;
        }
        const text = String(value);
        const cleanedText = text.startsWith('a:') ? text.substring(2) : text;
        const values = cleanedText.match(/-?\d+\.?\d*/g);
        return values ? values.map(Number) : [];
    }
}
