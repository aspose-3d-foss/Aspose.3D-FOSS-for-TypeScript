import { VertexElement } from './VertexElement';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { VertexElementType } from './VertexElementType';
import { FVector2, FVector3, FVector4 } from '../../utilities';

export class VertexElementFVector extends VertexElement {
    private _data: FVector4[] = [];
    private _indices: number[] = [];

    constructor(elementType: VertexElementType, name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        super(elementType, name, mappingMode, referenceMode);
    }

    setData(data: FVector4[] | FVector3[] | FVector2[]): void {
        if (Array.isArray(data) && data.length > 0) {
            if (data[0] instanceof FVector2) {
                this._data = data.map(v => new FVector4(v.x, v.y, 0.0, 0.0));
            } else if (data[0] instanceof FVector3) {
                this._data = data.map(v => new FVector4(v.x, v.y, v.z, 0.0));
            } else if (data[0] instanceof FVector4) {
                this._data = [...data];
            } else {
                throw new TypeError(`Unsupported data type for VertexElementFVector: ${typeof data[0]}`);
            }
        }
    }

    setIndices(data: number[]): void {
        this._indices = [...data];
    }

    clear(): void {
        this._data = [];
        this._indices = [];
    }

    copyTo(target: VertexElementFVector): void {
        target._data = [...this._data];
        target._indices = [...this._indices];
    }

    get data(): FVector4[] {
        return [...this._data];
    }

    get indices(): number[] {
        return [...this._indices];
    }
}
