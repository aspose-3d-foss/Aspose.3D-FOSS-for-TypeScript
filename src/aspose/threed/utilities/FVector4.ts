import { FVector2, FVector3 } from '.';

export class FVector4 {
    private _x: number = 0;
    private _y: number = 0;
    private _z: number = 0;
    private _w: number = 0;

    constructor();
    constructor(x: number, y: number, z: number, w: number);
    constructor(vec3: FVector3, w: number);
    constructor(vec2: FVector2, z: number, w: number);
    constructor(x?: number | FVector2 | FVector3, y?: number, z?: number, w?: number) {
        if (x === undefined) {
            this._x = 0.0;
            this._y = 0.0;
            this._z = 0.0;
            this._w = 0.0;
        } else if (x instanceof FVector3) {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
            this._w = y ?? 0;
        } else if (x instanceof FVector2) {
            this._x = x.x;
            this._y = x.y;
            this._z = y ?? 0;
            this._w = z ?? 0;
        } else if (typeof x === 'number') {
            this._x = x;
            this._y = y ?? 0;
            this._z = z ?? 0;
            this._w = w ?? 0;
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
            throw new Error('FVector4 index out of range');
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
            throw new Error('FVector4 index out of range');
        }
    }

    [key: number]: number;

    toString(): string {
        return `FVector4(${this._x}, ${this._y}, ${this._z}, ${this._w})`;
    }

    equals(other: FVector4): boolean {
        return this._x === other._x && this._y === other._y && this._z === other._z && this._w === other._w;
    }
}
