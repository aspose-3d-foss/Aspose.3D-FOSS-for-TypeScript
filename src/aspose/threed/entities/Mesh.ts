import { Geometry } from './Geometry';
import { Vector4 } from '../utilities/Vector4';
import { VertexElement } from './VertexElement';
import { VertexElementUV } from './VertexElementUV';
import { TextureMapping } from './TextureMapping';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { VertexElementType } from './VertexElementType';
import { Vector2 } from '../utilities/Vector2';
import { FVector2, FVector3, FVector4 } from '../utilities';

export class Mesh extends Geometry {
    private _controlPoints: Vector4[] = [];
    private _edges: number[] = [];
    private _polygons: number[] = [];
    private _polygonSizes: number[] = [];

    constructor(name: string = null, heightMap: any = null, transform: any = null, triMesh: boolean = null) {
        if (name === null) {
            name = '';
        }
        super(name);

        if (heightMap !== null) {
            throw new Error('height_map constructor is not implemented');
        }
    }

    get controlPoints(): Vector4[] {
        return [...this._controlPoints];
    }

    get edges(): number[] {
        return [...this._edges];
    }

    get polygonCount(): number {
        return this._polygonSizes.length;
    }

    get polygons(): number[][] {
        const result: number[][] = [];
        let offset = 0;
        for (const size of this._polygonSizes) {
            const polygon = this._polygons.slice(offset, offset + size);
            result.push([...polygon]);
            offset += size;
        }
        return result;
    }

    createPolygon(...args: any[]): void {
        if (args.length === 1 && Array.isArray(args[0])) {
            const indices = args[0];
            if (indices.length === 3) {
                this.createPolygon(indices[0], indices[1], indices[2]);
            } else if (indices.length === 4) {
                this.createPolygon(indices[0], indices[1], indices[2], indices[3]);
            } else {
                this._createPolygonFromList(indices);
            }
        } else if (args.length === 3) {
            const [v1, v2, v3] = args;
            this._polygonSizes.push(3);
            this._polygons.push(v1, v2, v3);
        } else if (args.length === 4) {
            const [v1, v2, v3, v4] = args;
            this._polygonSizes.push(4);
            this._polygons.push(v1, v2, v3, v4);
        } else if (args.length === 3 && typeof args[2] === 'number') {
            const [indices, offset, length] = args;
            this._polygonSizes.push(length);
            this._polygons.push(...indices.slice(offset, offset + length));
        } else {
            throw new TypeError('Invalid arguments for create_polygon');
        }
    }

    private _createPolygonFromList(indices: number[]): void {
        this._polygonSizes.push(indices.length);
        this._polygons.push(...indices);
    }

    getPolygonSize(index: number): number {
        if (index < 0 || index >= this._polygonSizes.length) {
            throw new Error('Polygon index out of range');
        }
        return this._polygonSizes[index];
    }

    toMesh(): Mesh {
        return this;
    }

    optimize(vertexElements: boolean = false, toleranceControlPoint: number = 1e-9, toleranceNormal: number = 1e-9, toleranceUV: number = 1e-9): Mesh {
        throw new Error('optimize is not implemented');
    }

    static doBoolean(op: any, a: Mesh, transformA: any, b: Mesh, transformB: any): Mesh {
        throw new Error('do_boolean is not implemented');
    }

    isManifold(): boolean {
        throw new Error('is_manifold is not implemented');
    }

    static union(a: Mesh, b: Mesh): Mesh {
        throw new Error('union is not implemented');
    }

    static difference(a: Mesh, b: Mesh): Mesh {
        throw new Error('difference is not implemented');
    }

    static intersect(a: Mesh, b: Mesh): Mesh {
        throw new Error('intersect is not implemented');
    }

    triangulate(): Mesh {
        const { PolygonModifier } = require('./PolygonModifier');
        return PolygonModifier.triangulate(this);
    }

    get deformers(): any[] {
        return [];
    }

    getBoundingBox(): any {
        const { BoundingBox } = require('../utilities');
        return new BoundingBox();
    }

    getEntityRendererKey(): any {
        throw new Error('get_entity_renderer_key is not implemented for Mesh');
    }
}
