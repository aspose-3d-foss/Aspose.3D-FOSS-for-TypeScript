import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { ColladaFormat } from './ColladaFormat';
import { ColladaSaveOptions } from './ColladaSaveOptions';
import { Node } from '../../Node';
import { Mesh } from '../../entities/Mesh';
import { Geometry } from '../../entities/Geometry';
import { PhongMaterial } from '../../shading/PhongMaterial';
import { LambertMaterial } from '../../shading/LambertMaterial';
import { Material } from '../../shading/Material';
import * as fs from 'fs';

export class ColladaExporter extends Exporter {
    private _indentLevel: number = 0;
    private _indentStr: string = '  ';
    private _materialIds: Map<Material, string> = new Map();
    private _geometryIds: Map<Geometry, string> = new Map();
    private _nodeIds: Map<Node, string> = new Map();
    private _materialCounter: number = 0;
    private _geometryCounter: number = 0;
    private _nodeCounter: number = 0;

    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ColladaFormat;
    }

    export(scene: Scene, stream: any, options: SaveOptions): void {
        const colladaOptions = options instanceof ColladaSaveOptions ? options : new ColladaSaveOptions();
        
        this._indentLevel = 0;
        this._materialIds.clear();
        this._geometryIds.clear();
        this._nodeIds.clear();
        this._materialCounter = 0;
        this._geometryCounter = 0;
        this._nodeCounter = 0;
        
        let output = '';
        
        output += this._indent('<?xml version="1.0" encoding="utf-8"?>\n', colladaOptions);
        output += this._indent('<COLLADA xmlns="http://www.collada.org/2005/11/COLLADASchema" version="1.4.1">\n', colladaOptions);
        
        this._indentLevel++;
        
        output += this._exportAsset(scene, colladaOptions);
        output += this._exportMaterials(scene, colladaOptions);
        output += this._exportGeometries(scene, colladaOptions);
        output += this._exportVisualScene(scene, colladaOptions);
        
        this._indentLevel--;
        
        output += this._indent('</COLLADA>\n', colladaOptions);
        
        if (typeof stream === 'string') {
            fs.writeFileSync(stream, output, 'utf-8');
        } else if (stream && typeof stream.write === 'function') {
            stream.write(output);
            if (stream.close) {
                stream.close();
            }
        }
    }

    private _indent(text: string, options: ColladaSaveOptions): string {
        if (options.indented) {
            return this._indentStr.repeat(this._indentLevel) + text;
        }
        return text;
    }

    private _exportAsset(_scene: Scene, options: ColladaSaveOptions): string {
        let output = '';
        output += this._indent('<asset>\n', options);
        this._indentLevel++;
        output += this._indent('<contributor>\n', options);
        this._indentLevel++;
        output += this._indent('<authoring_tool>Aspose.3D TypeScript</authoring_tool>\n', options);
        this._indentLevel--;
        output += this._indent('</contributor>\n', options);
        output += this._indent('<created>' + new Date().toISOString() + '</created>\n', options);
        output += this._indent('<modified>' + new Date().toISOString() + '</modified>\n', options);
        output += this._indent('<unit name="meter" meter="1"/>\n', options);
        output += this._indent('<up_axis>Z_UP</up_axis>\n', options);
        this._indentLevel--;
        output += this._indent('</asset>\n', options);
        return output;
    }

    private _exportMaterials(scene: Scene, options: ColladaSaveOptions): string {
        const materials = this._collectMaterials(scene);
        if (materials.size === 0) {
            return '';
        }
        
        let output = '';
        output += this._indent('<library_materials>\n', options);
        this._indentLevel++;
        
        for (const material of materials.keys()) {
            const materialId = this._getMaterialId(material);
            output += this._indent(`<material id="${materialId}" name="${material.name}">\n`, options);
            this._indentLevel++;
            output += this._indent(`<instance_effect url="#${materialId}_effect"/>\n`, options);
            this._indentLevel--;
            output += this._indent('</material>\n', options);
        }
        
        this._indentLevel--;
        output += this._indent('</library_materials>\n', options);
        
        output += this._indent('<library_effects>\n', options);
        this._indentLevel++;
        
        for (const [material, matId] of materials) {
            output += this._exportEffect(material, matId, options);
        }
        
        this._indentLevel--;
        output += this._indent('</library_effects>\n', options);
        
        return output;
    }

    private _exportEffect(material: Material, matId: string, options: ColladaSaveOptions): string {
        let output = '';
        output += this._indent(`<effect id="${matId}_effect">\n`, options);
        this._indentLevel++;
        output += this._indent('<profile_COMMON>\n', options);
        this._indentLevel++;
        output += this._indent('<technique sid="common">\n', options);
        this._indentLevel++;
        
        if (material instanceof PhongMaterial) {
            output += this._indent('<phong>\n', options);
            this._indentLevel++;
            output += this._exportPhongMaterial(material, options);
            this._indentLevel--;
            output += this._indent('</phong>\n', options);
        } else if (material instanceof LambertMaterial) {
            output += this._indent('<lambert>\n', options);
            this._indentLevel++;
            output += this._exportLambertMaterial(material, options);
            this._indentLevel--;
            output += this._indent('</lambert>\n', options);
        } else {
            output += this._indent('<lambert>\n', options);
            this._indentLevel++;
            output += this._exportLambertMaterial(new LambertMaterial(material.name), options);
            this._indentLevel--;
            output += this._indent('</lambert>\n', options);
        }
        
        this._indentLevel--;
        output += this._indent('</technique>\n', options);
        this._indentLevel--;
        output += this._indent('</profile_COMMON>\n', options);
        this._indentLevel--;
        output += this._indent('</effect>\n', options);
        
        return output;
    }

    private _exportPhongMaterial(material: PhongMaterial, options: ColladaSaveOptions): string {
        let output = '';
        
        if (material.emissiveColor) {
            output += this._exportColor('emission', material.emissiveColor, options);
        }
        if (material.ambientColor) {
            output += this._exportColor('ambient', material.ambientColor, options);
        }
        if (material.diffuseColor) {
            output += this._exportColor('diffuse', material.diffuseColor, options);
        }
        if (material.specularColor) {
            output += this._exportColor('specular', material.specularColor, options);
        }
        output += this._exportFloat('shininess', material.shininess, options);
        if (material.reflectionColor) {
            output += this._exportColor('reflective', material.reflectionColor, options);
        }
        output += this._exportFloat('reflectivity', material.reflectionFactor, options);
        if (material.transparentColor) {
            output += this._exportColor('transparent', material.transparentColor, options);
        }
        output += this._exportFloat('transparency', material.transparency, options);
        
        return output;
    }

    private _exportLambertMaterial(material: LambertMaterial, options: ColladaSaveOptions): string {
        let output = '';
        
        if (material.emissiveColor) {
            output += this._exportColor('emission', material.emissiveColor, options);
        }
        if (material.ambientColor) {
            output += this._exportColor('ambient', material.ambientColor, options);
        }
        if (material.diffuseColor) {
            output += this._exportColor('diffuse', material.diffuseColor, options);
        }
        if (material.transparentColor) {
            output += this._exportColor('transparent', material.transparentColor, options);
        }
        output += this._exportFloat('transparency', material.transparency, options);
        
        return output;
    }

    private _exportColor(name: string, color: any, options: ColladaSaveOptions): string {
        let output = '';
        output += this._indent(`<${name}>\n`, options);
        this._indentLevel++;
        output += this._indent(`<color>${color.x} ${color.y} ${color.z} 1.0</color>\n`, options);
        this._indentLevel--;
        output += this._indent(`</${name}>\n`, options);
        return output;
    }

    private _exportFloat(name: string, value: number, options: ColladaSaveOptions): string {
        let output = '';
        output += this._indent(`<${name}>\n`, options);
        this._indentLevel++;
        output += this._indent(`<float>${value}</float>\n`, options);
        this._indentLevel--;
        output += this._indent(`</${name}>\n`, options);
        return output;
    }

    private _exportGeometries(scene: Scene, options: ColladaSaveOptions): string {
        const geometries = this._collectGeometries(scene);
        if (geometries.size === 0) {
            return '';
        }
        
        let output = '';
        output += this._indent('<library_geometries>\n', options);
        this._indentLevel++;
        
        for (const geometry of geometries.keys()) {
            output += this._exportGeometry(geometry, options);
        }
        
        this._indentLevel--;
        output += this._indent('</library_geometries>\n', options);
        
        return output;
    }

    private _exportGeometry(geometry: Geometry, options: ColladaSaveOptions): string {
        if (!(geometry instanceof Mesh)) {
            return '';
        }
        
        const mesh = geometry as Mesh;
        const geometryId = this._getGeometryId(geometry);
        
        let output = '';
        output += this._indent(`<geometry id="${geometryId}" name="${geometry.name}">\n`, options);
        this._indentLevel++;
        output += this._indent('<mesh>\n', options);
        this._indentLevel++;
        
        const controlPoints = mesh.controlPoints;
        const positions: number[] = [];
        for (const cp of controlPoints) {
            let x = cp.x;
            let y = cp.y;
            let z = cp.z;
            if (options.flipCoordinateSystem) {
                [y, z] = [z, y];
            }
            positions.push(x, y, z);
        }
        
        const positionsId = `${geometryId}_positions`;
        output += this._indent(`<source id="${positionsId}">\n`, options);
        this._indentLevel++;
        output += this._indent(`<float_array id="${positionsId}_array" count="${positions.length}">${positions.join(' ')}</float_array>\n`, options);
        output += this._indent(`<technique_common>\n`, options);
        this._indentLevel++;
        output += this._indent(`<accessor source="#${positionsId}_array" count="${controlPoints.length}" stride="3">\n`, options);
        this._indentLevel++;
        output += this._indent('<param name="X" type="float"/>\n', options);
        output += this._indent('<param name="Y" type="float"/>\n', options);
        output += this._indent('<param name="Z" type="float"/>\n', options);
        this._indentLevel--;
        output += this._indent('</accessor>\n', options);
        this._indentLevel--;
        output += this._indent('</technique_common>\n', options);
        this._indentLevel--;
        output += this._indent('</source>\n', options);
        
        output += this._indent(`<vertices id="${geometryId}_vertices">\n`, options);
        this._indentLevel++;
        output += this._indent(`<input semantic="POSITION" source="#${positionsId}"/>\n`, options);
        this._indentLevel--;
        output += this._indent('</vertices>\n', options);
        
        const polygons = mesh.polygons;
        if (polygons.length > 0) {
            output += this._indent(`<triangles count="${polygons.length}">\n`, options);
            this._indentLevel++;
            output += this._indent(`<input semantic="VERTEX" source="#${geometryId}_vertices" offset="0"/>\n`, options);
            output += this._indent('<p>', options);
            for (const poly of polygons) {
                if (poly.length === 3) {
                    output += `${poly[0]} ${poly[1]} ${poly[2]} `;
                }
            }
            output += '</p>\n';
            this._indentLevel--;
            output += this._indent('</triangles>\n', options);
        }
        
        this._indentLevel--;
        output += this._indent('</mesh>\n', options);
        this._indentLevel--;
        output += this._indent('</geometry>\n', options);
        
        return output;
    }

    private _exportVisualScene(scene: Scene, options: ColladaSaveOptions): string {
        let output = '';
        output += this._indent('<library_visual_scenes>\n', options);
        this._indentLevel++;
        output += this._indent('<visual_scene id="Scene" name="Scene">\n', options);
        this._indentLevel++;
        
        for (const childNode of scene.rootNode.childNodes) {
            output += this._exportNode(childNode, options);
        }
        
        this._indentLevel--;
        output += this._indent('</visual_scene>\n', options);
        this._indentLevel--;
        output += this._indent('</library_visual_scenes>\n', options);
        
        output += this._indent('<scene>\n', options);
        this._indentLevel++;
        output += this._indent('<instance_visual_scene url="#Scene"/>\n', options);
        this._indentLevel--;
        output += this._indent('</scene>\n', options);
        
        return output;
    }

    private _exportNode(node: Node, options: ColladaSaveOptions): string {
        const nodeId = this._getNodeId(node);
        
        let output = '';
        output += this._indent(`<node id="${nodeId}" name="${node.name}">\n`, options);
        this._indentLevel++;
        
        const translation = node.transform.translation;
        output += this._indent(`<translate>${translation.x} ${translation.y} ${translation.z}</translate>\n`, options);
        
        const rotation = node.transform.rotation;
        const angle = 2 * Math.acos(rotation.w);
        const s = Math.sqrt(1 - rotation.w * rotation.w);
        if (s > 0.001) {
            const rx = rotation.x / s;
            const ry = rotation.y / s;
            const rz = rotation.z / s;
            const angleDeg = angle * 180 / Math.PI;
            output += this._indent(`<rotate>${rx} ${ry} ${rz} ${angleDeg}</rotate>\n`, options);
        }
        
        const scale = node.transform.scaling;
        output += this._indent(`<scale>${scale.x} ${scale.y} ${scale.z}</scale>\n`, options);
        
        if (node.entity && node.entity instanceof Geometry) {
            const geometryId = this._getGeometryId(node.entity);
            output += this._indent(`<instance_geometry url="#${geometryId}">\n`, options);
            this._indentLevel++;
            if (node.material) {
                const materialId = this._getMaterialId(node.material);
                output += this._indent('<bind_material>\n', options);
                this._indentLevel++;
                output += this._indent('<technique_common>\n', options);
                this._indentLevel++;
                output += this._indent(`<instance_material symbol="Material" target="#${materialId}"/>\n`, options);
                this._indentLevel--;
                output += this._indent('</technique_common>\n', options);
                this._indentLevel--;
                output += this._indent('</bind_material>\n', options);
            }
            this._indentLevel--;
            output += this._indent('</instance_geometry>\n', options);
        }
        
        for (const childNode of node.childNodes) {
            output += this._exportNode(childNode, options);
        }
        
        this._indentLevel--;
        output += this._indent('</node>\n', options);
        
        return output;
    }

    private _collectMaterials(scene: Scene): Map<Material, string> {
        const materials = new Map<Material, string>();
        this._collectMaterialsFromNode(scene.rootNode, materials);
        return materials;
    }

    private _collectMaterialsFromNode(node: Node, materials: Map<Material, string>): void {
        if (node.material && !materials.has(node.material)) {
            materials.set(node.material, this._getMaterialId(node.material));
        }
        for (const childNode of node.childNodes) {
            this._collectMaterialsFromNode(childNode, materials);
        }
    }

    private _collectGeometries(scene: Scene): Map<Geometry, string> {
        const geometries = new Map<Geometry, string>();
        this._collectGeometriesFromNode(scene.rootNode, geometries);
        return geometries;
    }

    private _collectGeometriesFromNode(node: Node, geometries: Map<Geometry, string>): void {
        if (node.entity && node.entity instanceof Geometry && !geometries.has(node.entity)) {
            geometries.set(node.entity, this._getGeometryId(node.entity));
        }
        for (const childNode of node.childNodes) {
            this._collectGeometriesFromNode(childNode, geometries);
        }
    }

    private _getMaterialId(material: Material): string {
        if (!this._materialIds.has(material)) {
            const id = `material_${this._materialCounter++}`;
            this._materialIds.set(material, id);
        }
        return this._materialIds.get(material)!;
    }

    private _getGeometryId(geometry: Geometry): string {
        if (!this._geometryIds.has(geometry)) {
            const id = `geometry_${this._geometryCounter++}`;
            this._geometryIds.set(geometry, id);
        }
        return this._geometryIds.get(geometry)!;
    }

    private _getNodeId(node: Node): string {
        if (!this._nodeIds.has(node)) {
            const id = `node_${this._nodeCounter++}`;
            this._nodeIds.set(node, id);
        }
        return this._nodeIds.get(node)!;
    }
}
