export class VertexFieldDataType {
    static readonly FLOAT = new VertexFieldDataType('FLOAT');
    static readonly F_VECTOR2 = new VertexFieldDataType('F_VECTOR2');
    static readonly F_VECTOR3 = new VertexFieldDataType('F_VECTOR3');
    static readonly F_VECTOR4 = new VertexFieldDataType('F_VECTOR4');
    static readonly DOUBLE = new VertexFieldDataType('DOUBLE');
    static readonly VECTOR2 = new VertexFieldDataType('VECTOR2');
    static readonly VECTOR3 = new VertexFieldDataType('VECTOR3');
    static readonly VECTOR4 = new VertexFieldDataType('VECTOR4');
    static readonly BYTE_VECTOR4 = new VertexFieldDataType('BYTE_VECTOR4');
    static readonly INT8 = new VertexFieldDataType('INT8');
    static readonly INT16 = new VertexFieldDataType('INT16');
    static readonly INT32 = new VertexFieldDataType('INT32');
    static readonly INT64 = new VertexFieldDataType('INT64');

    private _name: string;

    private constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    toString(): string {
        return this._name;
    }
}
