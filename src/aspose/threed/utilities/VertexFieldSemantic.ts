export class VertexFieldSemantic {
    static readonly POSITION = new VertexFieldSemantic('POSITION');
    static readonly BINORMAL = new VertexFieldSemantic('BINORMAL');
    static readonly NORMAL = new VertexFieldSemantic('NORMAL');
    static readonly TANGENT = new VertexFieldSemantic('TANGENT');
    static readonly UV = new VertexFieldSemantic('UV');
    static readonly VERTEX_COLOR = new VertexFieldSemantic('VERTEX_COLOR');
    static readonly VERTEX_CREASE = new VertexFieldSemantic('VERTEX_CREASE');
    static readonly EDGE_CREASE = new VertexFieldSemantic('EDGE_CREASE');
    static readonly USER_DATA = new VertexFieldSemantic('USER_DATA');
    static readonly VISIBILITY = new VertexFieldSemantic('VISIBILITY');
    static readonly SPECULAR = new VertexFieldSemantic('SPECULAR');
    static readonly WEIGHT = new VertexFieldSemantic('WEIGHT');
    static readonly MORPH_POSITION = new VertexFieldSemantic('MORPH_POSITION');
    static readonly MORPH_NORMAL = new VertexFieldSemantic('MORPH_NORMAL');

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
