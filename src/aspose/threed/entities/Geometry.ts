import { Entity } from '../Entity';
import { Property } from '../Property';
import { PropertyCollection } from '../PropertyCollection';
import { Scene } from '../Scene';
import { Vector4 } from '../../utilities/Vector4';
import { VertexElement } from './VertexElement';
import { VertexElementUV } from './VertexElementUV';
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

    constructor(name: string = null) {
        if (name === null) {
            name = '';
        }
        super(name);
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

    createElement(elementType: VertexElementType, mappingMode: MappingMode = null, referenceMode: ReferenceMode = null): VertexElement {
        const element = new VertexElementFVector(elementType, '', mappingMode, referenceMode);
        this._vertexElements.push(element);
        return element;
    }

    createElementUV(uvMapping: TextureMapping, mappingMode: MappingMode = null, referenceMode: ReferenceMode = null): VertexElementUV {
        const element = new VertexElementUV(uvMapping, '', mappingMode, referenceMode);
        this._vertexElements.push(element);
        return element;
    }

    addElement(element: VertexElement): void {
        this._vertexElements.push(element);
    }

    getElement(elementType: VertexElementType): VertexElement {
        for (const element of this._vertexElements) {
            if (element.vertexElementType === elementType) {
                return element;
            }
        }
        return null;
    }

    getVertexElementOfUV(textureMapping: TextureMapping): VertexElementUV {
        for (const element of this._vertexElements) {
            if (element instanceof VertexElementUV && element.textureMapping === textureMapping) {
                return element;
            }
        }
        return null;
    }

    removeProperty(prop: Property | string): boolean {
        return false;
    }

    getProperty(property: string): any {
        return null;
    }

    setProperty(property: string, value: any): void {
    }

    findProperty(property: string): Property {
        return null;
    }

    getBoundingBox(): any {
        const { BoundingBox } = require('../../utilities');
        return new BoundingBox();
    }

    getEntityRendererKey(): any {
        throw new Error('get_entity_renderer_key is not implemented for Geometry');
    }
}
