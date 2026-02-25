import { VertexFieldSemantic } from './VertexFieldSemantic';

export class SemanticAttribute {
    private _semantic: VertexFieldSemantic;
    private _alias: string;

    constructor(semantic: VertexFieldSemantic);
    constructor(semantic: VertexFieldSemantic, alias: string);
    constructor(...args: any[]) {
        this._semantic = args[0];
        this._alias = args.length > 1 ? args[1] : args[0].toString();
    }

    get semantic(): VertexFieldSemantic {
        return this._semantic;
    }

    get alias(): string {
        return this._alias;
    }
}
