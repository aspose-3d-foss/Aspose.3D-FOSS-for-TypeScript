import { Importer } from '../Importer';
import { LoadOptions } from '../LoadOptions';
import { Scene } from '../Scene';

export class FbxImporter extends Importer {
    private _objectMap: { [key: number]: any } = {};

    constructor() {
        super();
    }

    supportsFormat(fileFormat: any): boolean {
        const { FbxFormat } = require('./FbxFormat');
        return fileFormat instanceof FbxFormat;
    }

    open(filename: string, options?: LoadOptions): Scene {
        const { FbxLoadOptions } = require('./FbxLoadOptions');
        const { FbxParser } = require('./parser');
        const FbxTokenizer = require('./tokenizer').FbxTokenizer;
        const BinaryTokenizer = require('./binary_tokenizer').BinaryTokenizer;
        const { Scene } = require('../Scene');

        if (!options) {
            options = new FbxLoadOptions();
        }

        const tokens = this._getTokensFromFile(filename);
        const parser = new FbxParser(tokens);
        const scene = new Scene();

        this._parseScene(parser.rootScope, scene);

        return scene;
    }

    openFromStream(stream: any, options?: LoadOptions): Scene {
        const { FbxLoadOptions } = require('./FbxLoadOptions');
        const { FbxParser } = require('./parser');
        const FbxTokenizer = require('./tokenizer').FbxTokenizer;
        const BinaryTokenizer = require('./binary_tokenizer').BinaryTokenizer;
        const { Scene } = require('../Scene');

        if (!options) {
            options = new FbxLoadOptions();
        }

        const tokens = this._getTokensFromStream(stream);
        const parser = new FbxParser(tokens);
        const scene = new Scene();

        this._parseScene(parser.rootScope, scene);

        return scene;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        const { FbxParser } = require('./parser');
        const tokens = this._getTokensFromStream(stream);
        const parser = new FbxParser(tokens);

        this._parseScene(parser.rootScope, scene);
    }

    private _getTokensFromFile(filename: string): any[] {
        const fs = require('fs');
        const data = fs.readFileSync(filename);

        if (this._isBinaryFile(data)) {
            const BinaryTokenizer = require('./binary_tokenizer').BinaryTokenizer;
            const tokenizer = new BinaryTokenizer(data);
            return tokenizer.tokenize();
        } else {
            const content = data.toString('utf-8');
            const FbxTokenizer = require('./tokenizer').FbxTokenizer;
            const tokenizer = new FbxTokenizer(content);
            return tokenizer.tokenize();
        }
    }

    private _getTokensFromStream(stream: any): any[] {
        const content = stream.read();

        if (content instanceof Buffer) {
            if (this._isBinaryFile(content)) {
                const BinaryTokenizer = require('./binary_tokenizer').BinaryTokenizer;
                const tokenizer = new BinaryTokenizer(content);
                return tokenizer.tokenize();
            } else {
                const contentStr = content.toString('utf-8');
                const FbxTokenizer = require('./tokenizer').FbxTokenizer;
                const tokenizer = new FbxTokenizer(contentStr);
                return tokenizer.tokenize();
            }
        } else {
            const FbxTokenizer = require('./tokenizer').FbxTokenizer;
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

        this._parseGeometries(geometryElements, scene);
        this._parseModels(modelElements, scene);
        this._parseMaterials(materialElements, scene);
        this._parseConnections(rootScope, scene);
    }

    private _parseGeometries(geometryElements: any[], scene: Scene): void {
        const { Mesh } = require('../entities/Mesh');
        const { Vector4 } = require('../utilities/Vector4');

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
                            mesh.polygons.push(Math.abs(idx) - 1);
                            mesh.polygons.push(0xFFFFFFFF);
                        } else {
                            mesh.polygons.push(idx);
                        }
                    }
                }
            }

            const normalElement = geomScope.getFirstElement('Normals');
            if (normalElement && normalElement.compound) {
                const aElem = normalElement.compound.getFirstElement('a');
                if (aElem) {
                    const normals = this._parseFloatArray(aElem.tokens[0].text);
                    const { VertexElementNormal } = require('../entities/VertexElementNormal');
                    const { VertexElementType } = require('../entities/VertexElementType');
                    const { FVector4 } = require('../utilities/FVector4');
                    const vertexElement = mesh.createElement(VertexElementType.Normal);
                    const { MappingMode } = require('../entities/MappingMode');
                    vertexElement.mappingMode = MappingMode.CONTROL_POINT;
                    const normalData: FVector4[] = [];
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
                    const { TextureMapping } = require('../entities/TextureMapping');
                    const { FVector2 } = require('../utilities/FVector2');
                    const vertexElement = mesh.createElementUV(TextureMapping.DIFFUSE);
                    const { MappingMode } = require('../entities/MappingMode');
                    vertexElement.mappingMode = MappingMode.CONTROL_POINT;
                    const uvData: FVector2[] = [];
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

    private _parseModels(modelElements: any[], scene: Scene): void {
        const { Node } = require('../Node');

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
                    node.name = tokenValue.trim('"');
                }
            }
        }
    }

    private _parseMaterials(materialElements: any[], scene: Scene): void {
        const { LambertMaterial } = require('../shading/LambertMaterial');

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
                    material.name = tokenValue.trim('"');
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
            connType.trim('"');

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
            parentObj = this._objectMap[parentId];
            if (!parentObj) {
                return;
            }
        }

        const { Mesh } = require('../entities/Mesh');
        const { Node } = require('../Node');
        const { Material } = require('../shading/Material');

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
