import { Entity } from '../Entity';
import { Property } from '../Property';
import { Vector4 } from '../utilities/Vector4';
import { VertexElement } from './VertexElement';
import { VertexElementUV } from './VertexElementUV';
import { VertexElementFVector } from './VertexElementFVector';
import { TextureMapping } from './TextureMapping';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { VertexElementType } from './VertexElementType';

export class Geometry extends Entity {
    private _vertexElements: VertexElement[] = [];
    private _controlPoints: Vector4[] = [];
    private _visible = true;
    private _castShadows = true;
    private _receiveShadows = true;

    constructor(name: string | null = null) {
        super(name ?? '');
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = Boolean(value);
    }

    get castShadows(): boolean {
        return this._castShadows;
    }

    set castShadows(value: boolean) {
        this._castShadows = Boolean(value);
    }

    get receiveShadows(): boolean {
        return this._receiveShadows;
    }

    set receiveShadows(value: boolean) {
        this._receiveShadows = Boolean(value);
    }

    get vertexElements(): VertexElement[] {
        return [...this._vertexElements];
    }

    get controlPoints(): Vector4[] {
        return [...this._controlPoints];
    }

    set controlPoints(value: Vector4[]) {
        this._controlPoints = [...value];
    }

    addControlPoint(point: Vector4): void {
        this._controlPoints.push(point);
    }

    createElement(elementType: VertexElementType, mappingMode: MappingMode | null = null, referenceMode: ReferenceMode | null = null): VertexElement {
        const element = new VertexElementFVector(elementType, '', mappingMode ?? MappingMode.CONTROL_POINT, referenceMode ?? ReferenceMode.DIRECT);
        this._vertexElements.push(element);
        return element;
    }

    createElementUV(uvMapping: TextureMapping, mappingMode: MappingMode | null = null, referenceMode: ReferenceMode | null = null): VertexElementUV {
        const element = new VertexElementUV(uvMapping, '', mappingMode ?? MappingMode.CONTROL_POINT, referenceMode ?? ReferenceMode.DIRECT);
        this._vertexElements.push(element);
        return element;
    }

    addElement(element: VertexElement): void {
        this._vertexElements.push(element);
    }

    getElement(elementType: VertexElementType): VertexElement | null {
        for (const element of this._vertexElements) {
            if (element.vertexElementType === elementType) {
                return element;
            }
        }
        return null;
    }

    getVertexElementOfUV(textureMapping: TextureMapping): VertexElementUV | null {
        for (const element of this._vertexElements) {
            if (element instanceof VertexElementUV && element.textureMapping === textureMapping) {
                return element;
            }
        }
        return null;
    }

    removeProperty(_prop: Property | string): boolean {
        return false;
    }

    getProperty(_property: string): any {
        return null;
    }

    setProperty(_property: string, _value: any): void {
    }

    findProperty(_property: string): Property | null {
        return null;
    }

    getBoundingBox(): any {
        const { BoundingBox } = require('../utilities');
        return new BoundingBox();
    }

    getEntityRendererKey(): any {
        throw new Error('get_entity_renderer_key is not implemented for Geometry');
    }
}
