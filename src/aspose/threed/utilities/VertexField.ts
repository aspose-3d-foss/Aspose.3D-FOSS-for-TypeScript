import { VertexFieldDataType } from './VertexFieldDataType';
import { VertexFieldSemantic } from './VertexFieldSemantic';

export class VertexField {
    private _dataType: VertexFieldDataType;
    private _semantic: VertexFieldSemantic;
    private _alias: string;
    private _offset: number;
    private _index: number;
    private _size: number;

    constructor(dataType: VertexFieldDataType, semantic: VertexFieldSemantic, alias: string, offset: number, index: number = -1) {
        this._dataType = dataType;
        this._semantic = semantic;
        this._alias = alias;
        this._offset = offset;
        this._index = index;
        this._size = this._calculateSize(dataType);
    }

    compareTo(other: VertexField): number {
        if (this._offset !== other._offset) {
            return this._offset < other._offset ? -1 : 1;
        }
        if (this._index !== other._index) {
            return this._index < other._index ? -1 : 1;
        }
        if (this._semantic !== other._semantic) {
            return this._semantic.toString() < other._semantic.toString() ? -1 : 1;
        }
        return 0;
    }

    get dataType(): VertexFieldDataType {
        return this._dataType;
    }

    get semantic(): VertexFieldSemantic {
        return this._semantic;
    }

    get alias(): string {
        return this._alias;
    }

    get index(): number {
        return this._index;
    }

    get offset(): number {
        return this._offset;
    }

    get size(): number {
        return this._size;
    }

    private _calculateSize(dataType: VertexFieldDataType): number {
        switch (dataType) {
            case VertexFieldDataType.FLOAT:
            case VertexFieldDataType.INT8:
            case VertexFieldDataType.INT16:
            case VertexFieldDataType.INT32:
            case VertexFieldDataType.INT64:
            case VertexFieldDataType.DOUBLE:
                return 8;
            case VertexFieldDataType.F_VECTOR2:
            case VertexFieldDataType.VECTOR2:
                return 8;
            case VertexFieldDataType.F_VECTOR3:
            case VertexFieldDataType.VECTOR3:
                return 12;
            case VertexFieldDataType.F_VECTOR4:
            case VertexFieldDataType.VECTOR4:
            case VertexFieldDataType.BYTE_VECTOR4:
                return 16;
            default:
                return 0;
        }
    }
}
