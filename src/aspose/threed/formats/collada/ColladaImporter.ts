import { Importer } from '../Importer';
import { Scene } from '../../Scene';
import { LoadOptions } from '../LoadOptions';
import { FileFormat } from '../../FileFormat';
import { ColladaLoadOptions } from './ColladaLoadOptions';
import { ColladaFormat } from './ColladaFormat';
import { SceneObject } from '../../SceneObject';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';
import { Vector4 } from '../../utilities/Vector4';
import { Vector3 } from '../../utilities/Vector3';
import { Quaternion } from '../../utilities/Quaternion';
import { Material } from '../../shading/Material';
import { LambertMaterial } from '../../shading/LambertMaterial';
import { PhongMaterial } from '../../shading/PhongMaterial';

export class ColladaImporter extends Importer {
    private _materialMap: Map<string, { name: string; effect: string }> = new Map();
    private _effectMap: Map<string, any> = new Map();
    private _meshMap: Map<string, any> = new Map();

    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ColladaFormat;
    }

    importScene(scene: Scene, stream: any, options: LoadOptions): void {
        if (!(options instanceof ColladaLoadOptions)) {
            options = new ColladaLoadOptions();
        }

        const oOptions = options as ColladaLoadOptions;

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

        const scale = oOptions.scale;
        const flipCoords = oOptions.flipCoordinateSystem;

        const doc = this._parseXml(content);

        if (!doc || !doc.documentElement || doc.documentElement.tagName !== 'COLLADA') {
            throw new Error('Invalid Collada file: missing COLLADA root element');
        }

        const ns = 'http://www.collada.org/2005/11/COLLADASchema';

        if (oOptions.enableMaterials) {
            this._parseMaterialsAndEffects(doc, ns);
        }

        this._parseGeometries(doc, ns);

        const visualScene = this._findVisualScene(doc, ns);
        if (visualScene) {
            this._processVisualScene(visualScene, scene.rootNode, ns, scale, flipCoords, oOptions, scene);
        }
    }

    private _parseXml(content: string): any {
        const DOMParser = require('xmldom').DOMParser;
        const parser = new DOMParser();
        return parser.parseFromString(content, 'text/xml');
    }

    private _findChild(parent: any, path: string, ns: string): any {
        if (!parent || !path) return null;
        const parts = path.split('/');
        let current = parent;
        for (const part of parts) {
            if (current) {
                const elements = current.getElementsByTagNameNS(ns, part);
                if (elements.length > 0) {
                    current = elements[0];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
        return current;
    }

    private _parseMaterialsAndEffects(doc: any, ns: string): void {
        const libraryEffects = doc.getElementsByTagNameNS(ns, 'library_effects');
        for (let i = 0; i < libraryEffects.length; i++) {
            const effects = libraryEffects[i].getElementsByTagNameNS(ns, 'effect');
            for (let j = 0; j < effects.length; j++) {
                const effect = effects[j];
                const effectId = effect.getAttribute('id') || '';
                const effectData = this._parseEffect(effect, ns);
                this._effectMap.set(effectId, effectData);
            }
        }

        const libraryMaterials = doc.getElementsByTagNameNS(ns, 'library_materials');
        for (let i = 0; i < libraryMaterials.length; i++) {
            const materials = libraryMaterials[i].getElementsByTagNameNS(ns, 'material');
            for (let j = 0; j < materials.length; j++) {
                const material = materials[j];
                const matId = material.getAttribute('id') || '';
                const matName = material.getAttribute('name') || '';
                const instanceEffect = this._findChild(material, 'instance_effect', ns);
                if (instanceEffect) {
                    const effectUrl = instanceEffect.getAttribute('url') || '';
                    this._materialMap.set(matId, {
                        name: matName,
                        effect: effectUrl.replace('#', '')
                    });
                }
            }
        }
    }

    private _parseEffect(effect: any, ns: string): any {
        const effectData: any = {
            type: null,
            emission: null,
            ambient: null,
            diffuse: null,
            specular: null,
            shininess: 0.0,
            reflective: null,
            reflectivity: 0.0,
            transparent: null,
            transparency: 0.0
        };

        const profileCommon = this._findChild(effect, 'profile_COMMON', ns);
        if (!profileCommon) {
            return effectData;
        }

        const technique = this._findChild(profileCommon, 'technique', ns);
        if (!technique) {
            return effectData;
        }

        const phong = this._findChild(technique, 'phong', ns);
        const lambert = this._findChild(technique, 'lambert', ns);
        const blinn = this._findChild(technique, 'blinn', ns);

        let shader = phong || lambert || blinn;
        if (!shader) {
            return effectData;
        }

        if (phong) {
            effectData.type = 'phong';
        } else if (lambert) {
            effectData.type = 'lambert';
        } else {
            effectData.type = 'blinn';
        }

        effectData.emission = this._parseColor(shader, 'emission/color', ns);
        effectData.ambient = this._parseColor(shader, 'ambient/color', ns);
        effectData.diffuse = this._parseColor(shader, 'diffuse/color', ns);

        if (phong) {
            effectData.specular = this._parseColor(shader, 'specular/color', ns);
            effectData.shininess = this._parseFloat(shader, 'shininess/float', ns);
            effectData.reflective = this._parseColor(shader, 'reflective/color', ns);
            effectData.reflectivity = this._parseFloat(shader, 'reflectivity/float', ns);
        }

        effectData.transparent = this._parseColor(shader, 'transparent/color', ns);
        effectData.transparency = 1.0 - this._parseFloat(shader, 'transparency/float', ns);

        return effectData;
    }

    private _parseColor(parent: any, path: string, ns: string): Vector3 | null {
        const element = this._findChild(parent, path, ns);
        if (element && element.textContent) {
            const values = element.textContent.trim().split(/\s+/).filter((v: string) => v);
            if (values.length >= 3) {
                return new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
            }
        }
        return null;
    }

    private _parseFloat(parent: any, path: string, ns: string): number {
        const element = this._findChild(parent, path, ns);
        if (element && element.textContent) {
            return parseFloat(element.textContent.trim());
        }
        return 0.0;
    }

    private _parseGeometries(doc: any, ns: string): void {
        const libraryGeometries = doc.getElementsByTagNameNS(ns, 'library_geometries');
        for (let i = 0; i < libraryGeometries.length; i++) {
            const geometries = libraryGeometries[i].getElementsByTagNameNS(ns, 'geometry');
            for (let j = 0; j < geometries.length; j++) {
                const geometry = geometries[j];
                const geomId = geometry.getAttribute('id') || '';
                const mesh = this._findChild(geometry, 'mesh', ns);
                if (!mesh) {
                    continue;
                }

                const meshData: any = {
                    positions: [],
                    normals: [],
                    uvs: [],
                    vertices: {}
                };

                const sources = mesh.getElementsByTagNameNS(ns, 'source');
                for (let k = 0; k < sources.length; k++) {
                    const source = sources[k];
                    const sourceId = source.getAttribute('id') || '';
                    const floatArray = this._findChild(source, 'float_array', ns);
                    if (floatArray && floatArray.textContent) {
                        const values = floatArray.textContent.trim().split(/\s+/).filter((v: string) => v);
                        if (sourceId.toLowerCase().includes('position')) {
                            meshData.positions = values.map((v: string) => parseFloat(v));
                        } else if (sourceId.toLowerCase().includes('normal')) {
                            meshData.normals = values.map((v: string) => parseFloat(v));
                        } else if (sourceId.toLowerCase().includes('texcoord')) {
                            meshData.uvs = values.map((v: string) => parseFloat(v));
                        }
                    }
                }

                const verticesList = mesh.getElementsByTagNameNS(ns, 'vertices');
                for (let k = 0; k < verticesList.length; k++) {
                    const vertices = verticesList[k];
                    const vertId = vertices.getAttribute('id') || '';
                    const inputs = vertices.getElementsByTagNameNS(ns, 'input');
                    for (let l = 0; l < inputs.length; l++) {
                        const input = inputs[l];
                        if (input.getAttribute('semantic') === 'POSITION') {
                            const sourceUrl = input.getAttribute('source') || '';
                            meshData.vertices[vertId] = sourceUrl.replace('#', '');
                        }
                    }
                }

                const trianglesList = mesh.getElementsByTagNameNS(ns, 'triangles');
                if (trianglesList.length > 0) {
                    meshData.triangles = Array.from(trianglesList);
                }

                const polylistsList = mesh.getElementsByTagNameNS(ns, 'polylist');
                if (polylistsList.length > 0) {
                    meshData.polylists = Array.from(polylistsList);
                }

                this._meshMap.set(geomId, meshData);
            }
        }
    }

    private _findVisualScene(doc: any, ns: string): any {
        const libraryVisualScenes = doc.getElementsByTagNameNS(ns, 'library_visual_scenes');
        if (libraryVisualScenes.length === 0) {
            return null;
        }
        const visualScenes = libraryVisualScenes[0].getElementsByTagNameNS(ns, 'visual_scene');
        if (visualScenes.length === 0) {
            return null;
        }
        return visualScenes[0];
    }

    private _processVisualScene(visualScene: any, parentSceneNode: SceneObject, ns: string, scale: number, flipCoords: boolean, options: ColladaLoadOptions, scene: Scene): void {
        const nodes = visualScene.getElementsByTagNameNS(ns, 'node');
        for (let i = 0; i < nodes.length; i++) {
            this._processNode(nodes[i], parentSceneNode, ns, scale, flipCoords, options, scene);
        }
    }

    private _processNode(nodeElem: any, parentSceneNode: SceneObject, ns: string, scale: number, flipCoords: boolean, options: ColladaLoadOptions, scene: Scene): void {
        const nodeName = nodeElem.getAttribute('name') || 'node';
        const node = new Node(nodeName);
        node.parentNode = parentSceneNode as Node;

        let translation = new Vector3(0, 0, 0);
        let rotation = new Quaternion(1, 0, 0, 0);
        let scaleFactor = new Vector3(1, 1, 1);

        const translates = nodeElem.getElementsByTagNameNS(ns, 'translate');
        for (let i = 0; i < translates.length; i++) {
            const translate = translates[i];
            if (translate.textContent) {
                const values = translate.textContent.trim().split(/\s+/).filter((v: string) => v);
                if (values.length >= 3) {
                    let x = parseFloat(values[0]);
                    let y = parseFloat(values[1]);
                    let z = parseFloat(values[2]);
                    if (flipCoords) {
                        [y, z] = [z, y];
                    }
                    translation = new Vector3(x * scale, y * scale, z * scale);
                }
            }
        }

        const rotates = nodeElem.getElementsByTagNameNS(ns, 'rotate');
        for (let i = 0; i < rotates.length; i++) {
            const rotate = rotates[i];
            if (rotate.textContent) {
                const values = rotate.textContent.trim().split(/\s+/).filter((v: string) => v);
                if (values.length >= 4) {
                    let rx = parseFloat(values[0]);
                    let ry = parseFloat(values[1]);
                    let rz = parseFloat(values[2]);
                    let angleDeg = parseFloat(values[3]);
                    let angleRad = angleDeg * Math.PI / 180.0;
                    let axis = new Vector4(rx, ry, rz, 0);
                    if (flipCoords) {
                        axis.y = axis.z;
                    }
                    rotation = Quaternion.fromAngleAxis(angleRad, axis);
                }
            }
        }

        const scales = nodeElem.getElementsByTagNameNS(ns, 'scale');
        for (let i = 0; i < scales.length; i++) {
            const scaleElem = scales[i];
            if (scaleElem.textContent) {
                const values = scaleElem.textContent.trim().split(/\s+/).filter((v: string) => v);
                if (values.length >= 3) {
                    scaleFactor = new Vector3(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));
                }
            }
        }

        node.transform.translation = translation;
        node.transform.rotation = rotation;
        node.transform.scaling = scaleFactor;

        const instanceGeometries = nodeElem.getElementsByTagNameNS(ns, 'instance_geometry');
        for (let i = 0; i < instanceGeometries.length; i++) {
            const instanceGeometry = instanceGeometries[i];
            if (instanceGeometry.getAttribute('url')) {
                const geometryUrl = instanceGeometry.getAttribute('url')!.replace('#', '');
                const meshData = this._meshMap.get(geometryUrl);
                if (meshData && meshData.positions) {
                    const mesh = new Mesh(nodeName);
                    node.entity = mesh;

                    const vertexMap: Map<number, number> = new Map();

                    for (let j = 0; j < meshData.positions.length; j += 3) {
                        if (j + 2 < meshData.positions.length) {
                            let x = meshData.positions[j] * scale;
                            let y = meshData.positions[j + 1] * scale;
                            let z = meshData.positions[j + 2] * scale;
                            if (flipCoords) {
                                [y, z] = [z, y];
                            }
                            const vertexIndex = j / 3;
                            vertexMap.set(vertexIndex, mesh.controlPoints.length);
                            mesh.controlPoints.push(new Vector4(x, y, z, 1));
                        }
                    }

                    if (meshData.triangles) {
                        for (const trianglesElem of meshData.triangles) {
                            this._processTriangles(trianglesElem, mesh, vertexMap, ns);
                        }
                    }

                    if (meshData.polylists) {
                        for (const polylistElem of meshData.polylists) {
                            this._processPolylist(polylistElem, mesh, vertexMap, ns);
                        }
                    }

                    if (options.enableMaterials) {
                        this._applyMaterialsToNode(node, instanceGeometry, this._materialMap, this._effectMap, ns);
                    }
                }
            }
        }

        const childNodes = nodeElem.getElementsByTagNameNS(ns, 'node');
        for (let i = 0; i < childNodes.length; i++) {
            this._processNode(childNodes[i], node, ns, scale, flipCoords, options, scene);
        }
    }

    private _processTriangles(trianglesElem: any, mesh: Mesh, vertexMap: Map<number, number>, ns: string): void {
        const pElem = this._findChild(trianglesElem, 'p', ns);
        if (!pElem || !pElem.textContent) {
            return;
        }

        const values = pElem.textContent.trim().split(/\s+/).filter((v: string) => v).map((v: string) => parseInt(v));

        const inputs = trianglesElem.getElementsByTagNameNS(ns, 'input');
        let maxOffset = 1;
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if (input.getAttribute('offset')) {
                maxOffset = Math.max(maxOffset, parseInt(input.getAttribute('offset')!) + 1);
            }
        }

        const count = values.length / (maxOffset + 1);

        for (let j = 0; j < count; j++) {
            const faceIndices: number[] = [];
            for (let k = 0; k < 3; k++) {
                const idx = j * (maxOffset + 1) + k;
                if (idx < values.length && vertexMap.has(values[idx])) {
                    faceIndices.push(vertexMap.get(values[idx])!);
                }
            }

            if (faceIndices.length >= 3) {
                mesh.createPolygon(faceIndices);
            }
        }
    }

    private _processPolylist(polylistElem: any, mesh: Mesh, vertexMap: Map<number, number>, ns: string): void {
        const vcountElem = this._findChild(polylistElem, 'vcount', ns);
        const pElem = this._findChild(polylistElem, 'p', ns);

        if (!vcountElem || !vcountElem.textContent || !pElem || !pElem.textContent) {
            return;
        }

        const vcounts = vcountElem.textContent.trim().split(/\s+/).filter((v: string) => v).map((v: string) => parseInt(v));
        const values = pElem.textContent.trim().split(/\s+/).filter((v: string) => v).map((v: string) => parseInt(v));

        let maxOffset = 1;
        const inputs = polylistElem.getElementsByTagNameNS(ns, 'input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            if (input.getAttribute('offset')) {
                maxOffset = Math.max(maxOffset, parseInt(input.getAttribute('offset')!) + 1);
            }
        }

        let valueIdx = 0;
        for (const vcount of vcounts) {
            if (vcount < 3) {
                valueIdx += vcount * maxOffset;
                continue;
            }

            const faceIndices: number[] = [];
            for (let j = 0; j < vcount; j++) {
                if (valueIdx < values.length && vertexMap.has(values[valueIdx])) {
                    faceIndices.push(vertexMap.get(values[valueIdx])!);
                }
                valueIdx += maxOffset;
            }

            if (faceIndices.length >= 3) {
                mesh.createPolygon(faceIndices);
            }
        }
    }

    private _applyMaterialsToNode(node: Node, instanceGeometry: any, materialMap: Map<string, any>, effectMap: Map<string, any>, ns: string): void {
        const bindMaterial = this._findChild(instanceGeometry, 'bind_material', ns);
        if (!bindMaterial) {
            return;
        }

        const techniqueCommon = this._findChild(bindMaterial, 'technique_common', ns);
        if (!techniqueCommon) {
            return;
        }

        const instanceMaterial = this._findChild(techniqueCommon, 'instance_material', ns);
        if (!instanceMaterial) {
            return;
        }

        const symbol = instanceMaterial.getAttribute('symbol') || '';
        const target = instanceMaterial.getAttribute('target') || '';

        const materialInfo = materialMap.get(target.replace('#', ''));
        if (materialInfo && effectMap.has(materialInfo.effect)) {
            const effectData = effectMap.get(materialInfo.effect);
            this._applyMaterialToNode(node, effectData);
        }
    }

    private _applyMaterialToNode(node: Node, effectData: any): void {
        let material: Material;
        const type = effectData.type;

        if (type === 'phong') {
            material = new PhongMaterial();
            if (effectData.specular) {
                material.specularColor = effectData.specular;
            }
            material.shininess = effectData.shininess;
            if (effectData.reflective) {
                material.reflectionColor = effectData.reflective;
            }
            material.reflectionFactor = effectData.reflectivity;
        } else {
            material = new LambertMaterial();
        }

        if (effectData.emission) {
            material.emissiveColor = effectData.emission;
        }
        if (effectData.ambient) {
            material.ambientColor = effectData.ambient;
        }
        if (effectData.diffuse) {
            material.diffuseColor = effectData.diffuse;
        }
        if (effectData.transparent) {
            material.transparentColor = effectData.transparent;
        }
        material.transparency = effectData.transparency;

        node.material = material;
    }
}
