import { FVector2, FVector3, FVector4 } from '.';

export class FVector3 {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor();
    constructor(x: number, y: number, z: number);
    constructor(vec2: FVector2, z: number);
    constructor(x: number | FVector2, y?: number, z: number = 0.0) {
        if (x === undefined) {
            this._x = 0.0;
            this._y = 0.0;
            this._z = 0.0;
        } else if (x instanceof FVector2) {
            this._x = x.x;
            this._y = x.y;
            this._z = Number(y!);
        } else if (typeof x === 'number') {
            this._x = x;
            this._y = Number(y!);
            this._z = Number(z);
        }
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = Number(value);
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = Number(value);
    }

    get z(): number {
        return this._z;
    }

    set z(value: number) {
        this._z = Number(value);
    }

    static zero(): FVector3 {
        return new FVector3(0.0, 0.0, 0.0);
    }

    static one(): FVector3 {
        return new FVector3(1.0, 1.0, 1.0);
    }

    static unitX(): FVector3 {
        return new FVector3(1.0, 0.0, 0.0);
    }

    static unitY(): FVector3 {
        return new FVector3(0.0, 1.0, 0.0);
    }

    static unitZ(): FVector3 {
        return new FVector3(0.0, 0.0, 1.0);
    }

    normalize(): FVector3 {
        const lenSq = this._x * this._x + this._y * this._y + this._z * this._z;
        if (lenSq === 0) {
            return new FVector3(0.0, 0.0, 0.0);
        }
        const length = Math.sqrt(lenSq);
        return new FVector3(this._x / length, this._y / length, this._z / length);
    }

    getItem(key: number): number {
        if (key === 0) {
            return this._x;
        } else if (key === 1) {
            return this._y;
        } else if (key === 2) {
            return this._z;
        } else {
            throw new Error('FVector3 index out of range');
        }
    }

    setItem(key: number, value: number): void {
        if (key === 0) {
            this._x = Number(value);
        } else if (key === 1) {
            this._y = Number(value);
        } else if (key === 2) {
            this._z = Number(value);
        } else {
            throw new Error('FVector3 index out of range');
        }
    }

    [key: number]: number;

    __repr__(): string {
        return `FVector3(${this._x}, ${this._y}, ${this._z})`;
    }

    equals(other: FVector3): boolean {
        return this._x === other._x && this._y === other._y && this._z === other._z;
    }
}
