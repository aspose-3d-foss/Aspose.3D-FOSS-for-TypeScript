export class ColladaTransformStyle {
    private static _componentsInstance: ColladaTransformStyle | null = null;
    private static _matrixInstance: ColladaTransformStyle | null = null;
    private _name: string;

    private constructor(name: string) {
        this._name = name;
    }

    static get COMPONENTS(): ColladaTransformStyle {
        if (!ColladaTransformStyle._componentsInstance) {
            ColladaTransformStyle._componentsInstance = new ColladaTransformStyle('COMPONENTS');
        }
        return ColladaTransformStyle._componentsInstance;
    }

    static get MATRIX(): ColladaTransformStyle {
        if (!ColladaTransformStyle._matrixInstance) {
            ColladaTransformStyle._matrixInstance = new ColladaTransformStyle('MATRIX');
        }
        return ColladaTransformStyle._matrixInstance;
    }

    get name(): string {
        return this._name;
    }

    toString(): string {
        return `ColladaTransformStyle.${this._name}`;
    }
}
