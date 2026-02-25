import { IIndexedVertexElement } from './IIndexedVertexElement';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { VertexElementType } from './VertexElementType';

export abstract class VertexElement implements IIndexedVertexElement {
    private _vertexElementType: VertexElementType;
    private _name: string;
    private _mappingMode: MappingMode;
    private _referenceMode: ReferenceMode;

    constructor(elementType: VertexElementType, name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        this._vertexElementType = elementType;
        this._name = name;
        this._mappingMode = mappingMode;
        this._referenceMode = referenceMode;
    }

    get vertexElementType(): VertexElementType {
        return this._vertexElementType;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = String(value);
    }

    get mappingMode(): MappingMode {
        return this._mappingMode;
    }

    set mappingMode(value: MappingMode) {
        this._mappingMode = value;
    }

    get referenceMode(): ReferenceMode {
        return this._referenceMode;
    }

    set referenceMode(value: ReferenceMode) {
        this._referenceMode = value;
    }

    setIndices(data: number[]): void {
        throw new Error('set_indices is not implemented');
    }

    clear(): void {
        throw new Error('clear is not implemented');
    }

    get indices(): number[] {
        throw new Error();
    }
}
