import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { FVector2 } from './FVector2';
import { FVector3 } from './FVector3';
import { FVector4 } from './FVector4';
import { VertexField } from './VertexField';

export class Vertex {
    private _data: ArrayBuffer;
    private _offset: number;
    private _declaration: VertexField[];
    private _vertexSize: number;

    constructor(data: ArrayBuffer, offset: number, declaration: VertexField[], vertexSize: number) {
        this._data = data;
        this._offset = offset;
        this._declaration = declaration;
        this._vertexSize = vertexSize;
    }

    compare(other: Vertex): number {
        return this.compareTo(other);
    }

    compareTo(other: Vertex): number {
        if (this._vertexSize !== other._vertexSize) {
            return this._vertexSize < other._vertexSize ? -1 : 1;
        }
        for (let i = 0; i < this._vertexSize; i++) {
            const byte1 = new Uint8Array(this._data)[this._offset + i];
            const byte2 = new Uint8Array(other._data)[other._offset + i];
            if (byte1 !== byte2) {
                return byte1 < byte2 ? -1 : 1;
            }
        }
        return 0;
    }

    readVector4(field: VertexField): Vector4 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 16);
        return new Vector4(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true), view.getFloat32(12, true));
    }

    readFVector4(field: VertexField): FVector4 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 16);
        return new FVector4(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true), view.getFloat32(12, true));
    }

    readVector3(field: VertexField): Vector3 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 12);
        return new Vector3(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true));
    }

    readFVector3(field: VertexField): FVector3 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 12);
        return new FVector3(view.getFloat32(0, true), view.getFloat32(4, true), view.getFloat32(8, true));
    }

    readVector2(field: VertexField): Vector2 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 8);
        return new Vector2(view.getFloat32(0, true), view.getFloat32(4, true));
    }

    readFVector2(field: VertexField): FVector2 {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 8);
        return new FVector2(view.getFloat32(0, true), view.getFloat32(4, true));
    }

    readDouble(field: VertexField): number {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 8);
        return view.getFloat64(0, true);
    }

    readFloat(field: VertexField): number {
        const f = this.findField(field);
        if (!f) {
            throw new Error(`Field not found: ${field.alias}`);
        }
        const view = new DataView(this._data, this._offset + f.offset, 4);
        return view.getFloat32(0, true);
    }

    private findField(field: VertexField): VertexField | null {
        return this._declaration.find(f => f.alias === field.alias) || null;
    }
}
