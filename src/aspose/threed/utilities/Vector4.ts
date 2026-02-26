import { FVector2, FVector3, FVector4 } from '.';

export class Vector4 {
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    constructor();
    constructor(x: number, y: number, z: number, w: number);
    constructor(vec3: FVector3, w: number);
    constructor(vec: FVector2, w: number);
    constructor(x?: FVector2 | FVector3 | number, y?: number, z?: number, w: number = 1.0) {
        if (x === undefined) {
            this._x = 0.0;
            this._y = 0.0;
            this._z = 0.0;
            this._w = 1.0;
        } else if (typeof x === 'number') {
            this._x = Number(x);
            this._y = Number(y!);
            this._z = Number(z!);
            this._w = w;
        } else if (x instanceof FVector3) {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this._w = Number(y!);
        } else if (x instanceof FVector2) {
            this._x = x.x;
            this._y = x.y;
            this._z = 0.0;
            this._w = Number(y!);
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

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = Number(value);
    }

    set(newX: number, newY: number, newZ: number, newW: number = 1.0): void {
        this._x = Number(newX);
        this._y = Number(newY);
        this._z = Number(newZ);
        this._w = Number(newW);
    }

    getItem(key: number): number {
        if (key === 0) {
            return this._x;
        } else if (key === 1) {
            return this._y;
        } else if (key === 2) {
            return this._z;
        } else if (key === 3) {
            return this._w;
        } else {
            throw new Error('Vector4 index out of range');
        }
    }

    setItem(key: number, value: number): void {
        if (key === 0) {
            this._x = Number(value);
        } else if (key === 1) {
            this._y = Number(value);
        } else if (key === 2) {
            this._z = Number(value);
        } else if (key === 3) {
            this._w = Number(value);
        } else {
            throw new Error('Vector4 index out of range');
        }
    }

    [key: number]: number;

    toString(): string {
        return `Vector4(${this._x}, ${this._y}, ${this._z}, ${this._w})`;
    }

    equals(other: Vector4): boolean {
        return this._x === other._x && this._y === other._y && this._z === other._z && this._w === other._w;
    }
}
