import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { FVector2 } from './FVector2';
import { FVector3 } from './FVector3';
import { FVector4 } from './FVector4';
import { VertexFieldDataType } from './VertexFieldDataType';
import { VertexFieldSemantic } from './VertexFieldSemantic';
import { VertexField } from './VertexField';
import { TriMesh } from '../entities/TriMesh';

export class VertexDeclaration {
    private _fields: VertexField[] = [];
    private _sealed: boolean = false;
    private _size: number = 0;

    constructor() {
    }

    clear(): void {
        if (this._sealed) {
            throw new Error('VertexDeclaration is sealed');
        }
        this._fields = [];
        this._size = 0;
    }

    addField(dataType: VertexFieldDataType, semantic: VertexFieldSemantic, index: number, alias: string): VertexField {
        if (this._sealed) {
            throw new Error('VertexDeclaration is sealed');
        }

        const fieldSize = this._getDataSize(dataType);
        const field = new VertexField(dataType, semantic, alias, this._size, index);
        this._fields.push(field);
        this._size += fieldSize;
        return field;
    }

    static fromGeometry(geometry: any, useFloat: boolean): VertexDeclaration {
        throw new Error('fromGeometry is not implemented');
    }

    compareTo(other: VertexDeclaration): number {
        if (this._fields.length !== other._fields.length) {
            return this._fields.length < other._fields.length ? -1 : 1;
        }

        for (let i = 0; i < this._fields.length; i++) {
            const result = this._fields[i].compareTo(other._fields[i]);
            if (result !== 0) {
                return result;
            }
        }

        return 0;
    }

    get sealed(): boolean {
        return this._sealed;
    }

    get count(): number {
        return this._fields.length;
    }

    get size(): number {
        return this._size;
    }

    [key: number]: any;

    getField(index: number): VertexField {
        return this._fields[index];
    }

    private _getDataSize(dataType: VertexFieldDataType): number {
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
