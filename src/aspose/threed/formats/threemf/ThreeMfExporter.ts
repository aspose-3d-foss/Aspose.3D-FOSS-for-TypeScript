import { Exporter } from '../Exporter';
import { Scene } from '../../Scene';
import { SaveOptions } from '../SaveOptions';
import { FileFormat } from '../../FileFormat';
import { ThreeMfSaveOptions } from './ThreeMfSaveOptions';
import { ThreeMfFormat } from './ThreeMfFormat';
import { Node } from '../..//Node';
import { Mesh } from '../..//entities/Mesh';

export class ThreeMfExporter extends Exporter {
    constructor() {
        super();
    }

    supportsFormat(fileFormat: FileFormat): boolean {
        return fileFormat instanceof ThreeMfFormat;
    }

    export(_scene: Scene, stream: any, options: SaveOptions): void {
        let threeMfOptions: ThreeMfSaveOptions;
        if (options instanceof ThreeMfSaveOptions) {
            threeMfOptions = options;
        } else {
            threeMfOptions = new ThreeMfSaveOptions();
        }

        const meshDataList = this._collectMeshes(_scene, threeMfOptions);
        const materials = this._collectMaterials(meshDataList);

        if (!meshDataList || meshDataList.length === 0) {
            return;
        }

        this._write3mfFile(stream, meshDataList, _scene, threeMfOptions, materials);
    }

    private _collectMeshes(scene: Scene, options: ThreeMfSaveOptions): any[] {
        const meshDataList: any[] = [];
        let objId = 1;

        const visitNode = (node: Node, parentTransform: any = null) => {
            const currentTransform = parentTransform ? parentTransform.concatenate(node.transform.transformMatrix) : node.transform.transformMatrix;

            if (node.entity && node.entity instanceof Mesh) {
                if (!options.buildAll) {
                    const format = ThreeMfFormat.getInstance();
                    if (!format.isBuildable(node)) {
                        return;
                    }
                }

                let mesh = node.entity;
                if (!this._isTriangulated(mesh)) {
                    mesh = mesh.triangulate();
                }

                const format = ThreeMfFormat.getInstance();
                const objectType = format.getObjectType(node);

                const objName = (node as any).name ? (node as any).name : `mesh_${objId}`;
                meshDataList.push({
                    id: objId,
                    name: objName,
                    type: objectType,
                    mesh: mesh,
                    transform: currentTransform,
                    node: node
                });
                objId++;
            }

            const childNodes = node.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                visitNode(childNodes[i], currentTransform);
            }
        };

        const rootChildNodes = scene.rootNode.childNodes;
        for (let i = 0; i < rootChildNodes.length; i++) {
            visitNode(rootChildNodes[i]);
        }

        return meshDataList;
    }

    private _isTriangulated(mesh: Mesh): boolean {
        const polygonCount = mesh.polygonCount;
        for (let i = 0; i < polygonCount; i++) {
            if (mesh.getPolygonSize(i) !== 3) {
                return false;
            }
        }
        return true;
    }

    private _collectMaterials(meshDataList: any[]): any[] {
        const materials: any[] = [];
        const materialToIndex: any = {};

        for (let i = 0; i < meshDataList.length; i++) {
            const meshData = meshDataList[i];
            const node = meshData.node;
            
            if (node && node.material) {
                const material = node.material;
                const materialKey = this._getMaterialKey(material);

                if (!materialToIndex[materialKey]) {
                    const materialIndex = materials.length;
                    materialToIndex[materialKey] = materialIndex;
                    materials.push({
                        material: material,
                        index: materialIndex
                    });
                }

                meshData.materialIndex = materialToIndex[materialKey];
            }
        }

        return materials;
    }

    private _getMaterialKey(material: any): string {
        let key = `${material.name}|${material.diffuseColor.x},${material.diffuseColor.y},${material.diffuseColor.z}`;

        if (material.specularColor) {
            key += `|${material.specularColor.x},${material.specularColor.y},${material.specularColor.z}`;
            if (material.specularFactor) {
                key += `|${material.specularFactor}`;
            }
        }

        const transparency = material.transparency || 0;
        key += `|${transparency}`;

        return key;
    }

    private _materialColorToString(material: any): string {
        const r = Math.floor(material.diffuseColor.x * 255);
        const g = Math.floor(material.diffuseColor.y * 255);
        const b = Math.floor(material.diffuseColor.z * 255);

        const transparency = material.transparency || 0;
        let a = 255;
        if (transparency > 0) {
            a = Math.floor((1.0 - transparency) * 255);
        }

        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        const aHex = a.toString(16).padStart(2, '0');

        return `#${rHex.toUpperCase()}${gHex.toUpperCase()}${bHex.toUpperCase()}${aHex.toUpperCase()}`;
    }

    private _write3mfFile(stream: any, meshDataList: any[], _scene: Scene, options: ThreeMfSaveOptions, materials: any[]): void {
        const xmlContent = this._build3mfXml(meshDataList, options, materials);

        const zip = new (require('adm-zip'))();
        zip.addFile('3D/3dmodel.model', Buffer.from(xmlContent, 'utf8'));

        const zipBuffer = zip.toBuffer();

        if (stream && stream.write) {
            try {
                stream.write(zipBuffer);
            } catch (e) {
                stream.write(zipBuffer);
            }
        }
    }

    private _build3mfXml(meshDataList: any[], options: ThreeMfSaveOptions, materials: any[]): string {
        const xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        const modelStart = `<model unit="${options.unit}" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02" xmlns:m="http://schemas.microsoft.com/3dmanufacturing/material/2015/02">\n`;
        
        let resources = '  <resources>\n';

        if (materials && materials.length > 0) {
            resources += '    <m:basematerials id="1">\n';
            for (let i = 0; i < materials.length; i++) {
                const matData = materials[i];
                const material = matData.material;
                const color = this._materialColorToString(material);
                const name = material.name || `Material_${matData.index}`;

                resources += `      <m:base name="${name}" displaycolor="${color}" />\n`;
            }
            resources += '    </m:basematerials>\n';
        }

        const scaleFactor = this._getUnitScaleFactor(options.unit);

        for (let i = 0; i < meshDataList.length; i++) {
            const meshData = meshDataList[i];
            const objectType = meshData.type || 'model';
            
            let objAttrs = `      <object id="${meshData.id}" name="${meshData.name}" type="${objectType}"`;
            
            if (meshData.materialIndex !== undefined) {
                objAttrs += ` pid="1" pindex="${meshData.materialIndex}"`;
            }
            
            objAttrs += '>\n';
            
            resources += objAttrs;
            
            resources += '        <mesh>\n';
            
            const vertices = '          <vertices>\n';
            resources += vertices;
            
            const mesh = meshData.mesh;
            const controlPoints = mesh.controlPoints;
            for (let j = 0; j < controlPoints.length; j++) {
                const v = controlPoints[j];
                let x = v.x * scaleFactor;
                let y = v.y * scaleFactor;
                let z = v.z * scaleFactor;
                
                if (options.flipCoordinateSystem) {
                    const temp = y;
                    y = z;
                    z = temp;
                }
                
                resources += `            <vertex x="${x.toFixed(6)}" y="${y.toFixed(6)}" z="${z.toFixed(6)}" />\n`;
            }
            
            resources += '          </vertices>\n';
            
            const triangles = '          <triangles>\n';
            resources += triangles;
            
            for (let j = 0; j < mesh.polygonCount; j++) {
                const v1 = mesh._polygons[j * 3];
                const v2 = mesh._polygons[j * 3 + 1];
                const v3 = mesh._polygons[j * 3 + 2];
                
                resources += `            <triangle v1="${v1}" v2="${v2}" v3="${v3}" />\n`;
            }
            
            resources += '          </triangles>\n';
            resources += '        </mesh>\n';
            resources += '      </object>\n';
        }
        
        resources += '  </resources>\n';
        
        let build = '  <build>\n';
        for (let i = 0; i < meshDataList.length; i++) {
            const meshData = meshDataList[i];
            const transformStr = this._matrixToString(meshData.transform);
            build += `    <item objectid="${meshData.id}" transform="${transformStr}" />\n`;
        }
        build += '  </build>\n';
        
        const modelEnd = '</model>';
        
        return xml + modelStart + resources + build + modelEnd;
    }

    private _getUnitScaleFactor(unit: string): number {
        const unitScales: any = {
            'micron': 1000000.0,
            'millimeter': 1000.0,
            'centimeter': 100.0,
            'inch': 39.37007874015748,
            'foot': 3.280839895013123,
            'meter': 1.0
        };
        return unitScales[unit] || 1000.0;
    }

    private _matrixToString(matrix: any): string {
        const m = matrix;
        const m00 = m.m00 ? m.m00.toFixed(6) : '0.000000';
        const m01 = m.m01 ? m.m01.toFixed(6) : '0.000000';
        const m02 = m.m02 ? m.m02.toFixed(6) : '0.000000';
        const m10 = m.m10 ? m.m10.toFixed(6) : '0.000000';
        const m11 = m.m11 ? m.m11.toFixed(6) : '0.000000';
        const m12 = m.m12 ? m.m12.toFixed(6) : '0.000000';
        const m20 = m.m20 ? m.m20.toFixed(6) : '0.000000';
        const m21 = m.m21 ? m.m21.toFixed(6) : '0.000000';
        const m22 = m.m22 ? m.m22.toFixed(6) : '0.000000';
        const m30 = m.m30 ? m.m30.toFixed(6) : '0.000000';
        const m31 = m.m31 ? m.m31.toFixed(6) : '0.000000';
        const m32 = m.m32 ? m.m32.toFixed(6) : '0.000000';
        
        return `${m00} ${m01} ${m02} ${m10} ${m11} ${m12} ${m20} ${m21} ${m22} ${m30} ${m31} ${m32}`;
    }
}
