export class Axis {
    static readonly POSITIVE_X = new Axis('POSITIVE_X');
    static readonly NEGATIVE_X = new Axis('NEGATIVE_X');
    static readonly POSITIVE_Y = new Axis('POSITIVE_Y');
    static readonly NEGATIVE_Y = new Axis('NEGATIVE_Y');
    static readonly POSITIVE_Z = new Axis('POSITIVE_Z');
    static readonly NEGATIVE_Z = new Axis('NEGATIVE_Z');

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
