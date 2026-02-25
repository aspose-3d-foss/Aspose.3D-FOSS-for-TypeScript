export class RotationOrder {
    static readonly XYZ = new RotationOrder('XYZ');
    static readonly XZY = new RotationOrder('XZY');
    static readonly YZX = new RotationOrder('YZX');
    static readonly YXZ = new RotationOrder('YXZ');
    static readonly ZXY = new RotationOrder('ZXY');
    static readonly ZYX = new RotationOrder('ZYX');

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
