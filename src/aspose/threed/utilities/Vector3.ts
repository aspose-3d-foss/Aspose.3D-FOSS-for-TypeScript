import { Vector4 } from './Vector4';
import { FVector3 } from './FVector3';

export class Vector3 {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x: number, y: number, z: number);
    constructor(vec: FVector3);
    constructor(v: number);
    constructor(x?: number | FVector3, y?: number, z?: number) {
        if (x === undefined) {
            this._x = 0.0;
            this._y = 0.0;
            this._z = 0.0;
        } else if (typeof x === 'number') {
            this._x = Number(x);
            this._y = Number(y!);
            this._z = Number(z!);
        } else if (x instanceof FVector3) {
            this._x = x.x;
            this._y = x.y;
            this._z = x.z;
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

    set(newX: number, newY: number, newZ: number): void {
        this._x = Number(newX);
        this._y = Number(newY);
        this._z = Number(newZ);
    }

    get length(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
    }

    get length2(): number {
        return this._x * this._x + this._y * this._y + this._z * this._z;
    }

    get zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    get unitX(): Vector3 {
        return new Vector3(1, 0, 0);
    }

    get unitY(): Vector3 {
        return new Vector3(0, 1, 0);
    }

    get unitZ(): Vector3 {
        return new Vector3(0, 0, 1);
    }

    dot(rhs: Vector3): number {
        return this._x * rhs._x + this._y * rhs._y + this._z * rhs._z;
    }

    cross(rhs: Vector3): Vector3 {
        return new Vector3(
            this._y * rhs._z - this._z * rhs._y,
            this._z * rhs._x - this._x * rhs._z,
            this._x * rhs._y - this._y * rhs._x
        );
    }

    normalize(): Vector3 {
        const lenSq = this.length2;
        if (lenSq === 0) {
            return new Vector3(0, 0, 0);
        }
        const length = Math.sqrt(lenSq);
        return new Vector3(this._x / length, this._y / length, this._z / length);
    }

    angleBetween(dir: Vector3, up?: Vector3): number {
        if (up === undefined) {
            const selfN = this.normalize();
            const dirN = dir.normalize();
            let dot = selfN.dot(dirN);
            dot = Math.max(-1.0, Math.min(1.0, dot));
            return Math.acos(dot);
        } else {
            const proj = this.minus(up.times(this.dot(up)));
            const dirProj = dir.minus(up.times(dir.dot(up)));
            const projN = proj.normalize();
            const dirProjN = dirProj.normalize();
            let dot = projN.dot(dirProjN);
            dot = Math.max(-1.0, Math.min(1.0, dot));
            return Math.acos(dot);
        }
    }

    sin(): Vector3 {
        return new Vector3(Math.sin(this._x), Math.sin(this._y), Math.sin(this._z));
    }

    cos(): Vector3 {
        return new Vector3(Math.cos(this._x), Math.cos(this._y), Math.cos(this._z));
    }

    compareTo(other: Vector3): number {
        if (this._x < other._x) {
            return -1;
        } else if (this._x > other._x) {
            return 1;
        } else if (this._y < other._y) {
            return -1;
        } else if (this._y > other._y) {
            return 1;
        } else if (this._z < other._z) {
            return -1;
        } else if (this._z > other._z) {
            return 1;
        }
        return 0;
    }

    static parse(input: string): Vector3 {
        const parts = input.trim().split(/\s+/);
        if (parts.length !== 3) {
            throw new Error(`Invalid Vector3 format: ${input}`);
        }
        return new Vector3(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
    }

    getItem(key: number): number {
        if (key === 0) {
            return this._x;
        } else if (key === 1) {
            return this._y;
        } else if (key === 2) {
            return this._z;
        } else {
            throw new Error('Vector3 index out of range');
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
            throw new Error('Vector3 index out of range');
        }
    }

    [key: number]: number;

    __repr__(): string {
        return `Vector3(${this._x}, ${this._y}, ${this._z})`;
    }

    equals(other: Vector3): boolean {
        return this._x === other._x && this._y === other._y && this._z === other._z;
    }

    minus(v: Vector3): Vector3 {
        return new Vector3(this._x - v._x, this._y - v._y, this._z - v._z);
    }

    times(scalar: number): Vector3 {
        return new Vector3(this._x * scalar, this._y * scalar, this._z * scalar);
    }
}
