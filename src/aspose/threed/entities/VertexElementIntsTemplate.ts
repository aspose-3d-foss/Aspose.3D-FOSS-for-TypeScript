import { VertexElement } from './VertexElement';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { VertexElementType } from './VertexElementType';

export class VertexElementIntsTemplate extends VertexElement {
    private _data: number[] = [];
    private _indices: number[] = [];

    constructor(elementType: VertexElementType, name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        super(elementType, name, mappingMode, referenceMode);
    }

    setData(data: number[]): void {
        this._data = [...data];
    }

    setIndices(data: number[]): void {
        this._indices = [...data];
    }

    clear(): void {
        this._data = [];
        this._indices = [];
    }

    copyTo(target: VertexElementIntsTemplate): void {
        target._data = [...this._data];
        target._indices = [...this._indices];
    }

    get data(): number[] {
        return [...this._data];
    }

    get indices(): number[] {
        return [...this._indices];
    }
}
