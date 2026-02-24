import { Vector3 } from './Vector3';

export class Quaternion {
    private _w: number;
    private _x: number;
    private _y: number;
    private _z: number;

    constructor();
    constructor(w: number, x: number, y: number, z: number);
    constructor(w?: number, x: number = 0, y: number = 0, z: number = 0) {
        if (w === undefined) {
            this._w = 1.0;
            this._x = 0.0;
            this._y = 0.0;
            this._z = 0.0;
        } else {
            this._w = Number(w);
            this._x = Number(x);
            this._y = Number(y);
            this._z = Number(z);
        }
    }

    get w(): number {
        return this._w;
    }

    set w(value: number) {
        this._w = Number(value);
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

    get length(): number {
        return Math.sqrt(this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z);
    }

    static get IDENTITY(): Quaternion {
        return new Quaternion(1.0, 0.0, 0.0, 0.0);
    }

    normalize(): Quaternion {
        const lenSq = this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z;
        if (lenSq === 0) {
            return new Quaternion(1.0, 0.0, 0.0, 0.0);
        }
        const length = Math.sqrt(lenSq);
        return new Quaternion(
            this._w / length,
            this._x / length,
            this._y / length,
            this._z / length
        );
    }

    conjugate(): Quaternion {
        return new Quaternion(this._w, -this._x, -this._y, -this._z);
    }

    inverse(): Quaternion {
        const lenSq = this._w * this._w + this._x * this._x + this._y * this._y + this._z * this._z;
        if (lenSq === 0) {
            throw new Error('Cannot inverse zero-length quaternion');
        }
        const conj = this.conjugate();
        const invLen = 1.0 / lenSq;
        return new Quaternion(
            conj._w * invLen,
            conj._x * invLen,
            conj._y * invLen,
            conj._z * invLen
        );
    }

    dot(q: Quaternion): number {
        return (this._w * q._w + this._x * q._x + this._y * q._y + this._z * q._z);
    }

    concat(rhs: Quaternion): Quaternion {
        return new Quaternion(
            this._w * rhs._w - this._x * rhs._x - this._y * rhs._y - this._z * rhs._z,
            this._w * rhs._x + this._x * rhs._w + this._y * rhs._z - this._z * rhs._y,
            this._w * rhs._y - this._x * rhs._z + this._y * rhs._w + this._z * rhs._x,
            this._w * rhs._z + this._x * rhs._y - this._y * rhs._x + this._z * rhs._w
        );
    }

    eulerAngles(): Vector3 {
        const sinX = 2.0 * (this._w * this._x + this._y * this._z);
        const cosX = 1.0 - 2.0 * (this._x * this._x + this._y * this._y);
        const rx = Math.atan2(sinX, cosX);

        const sinY = 2.0 * (this._w * this._y - this._z * this._x);
        let ry: number;
        if (Math.abs(sinY) >= 1.0) {
            ry = Math.copysign(Math.PI / 2.0, sinY);
        } else {
            ry = Math.asin(sinY);
        }

        const sinZ = 2.0 * (this._w * this._z + this._x * this._y);
        const cosZ = 1.0 - 2.0 * (this._y * this._y + this._z * this._z);
        const rz = Math.atan2(sinZ, cosZ);

        return new Vector3(rx, ry, rz);
    }

    static fromEulerAngle(pitch: number, yaw: number, roll: number): Quaternion;
    static fromEulerAngle(vec: Vector3): Quaternion;
    static fromEulerAngle(pitch: Vector3 | number, yaw?: number, roll?: number): Quaternion {
        let rx: number, ry: number, rz: number;

        if (typeof pitch === 'number') {
            rx = Number(pitch);
            ry = Number(yaw!);
            rz = Number(roll!);
        } else {
            rx = pitch.x;
            ry = pitch.y;
            rz = pitch.z;
        }

        const cy = Math.cos(ry * 0.5);
        const sy = Math.sin(ry * 0.5);
        const cp = Math.cos(rx * 0.5);
        const sp = Math.sin(rx * 0.5);
        const cr = Math.cos(rz * 0.5);
        const sr = Math.sin(rz * 0.5);

        const w = cr * cp * cy + sr * sp * sy;
        const x = sr * cp * cy - cr * sp * sy;
        const y = cr * sp * cy + sr * cp * sy;
        const z = cr * cp * sy - sr * sp * cy;

        return new Quaternion(w, x, y, z);
    }

    static fromAngleAxis(a: number, axis: Vector3): Quaternion {
        const halfAngle = a * 0.5;
        const s = Math.sin(halfAngle);
        return new Quaternion(
            Math.cos(halfAngle),
            axis.x * s,
            axis.y * s,
            axis.z * s
        );
    }

    static fromRotation(orig: Vector3, dest: Vector3): Quaternion {
        const origN = orig.normalize();
        const destN = dest.normalize();

        let dot = origN.dot(destN);

        if (dot < -0.999999) {
            let axis = new Vector3(1.0, 0.0, 0.0);
            if (Math.abs(origN.x) < 0.9) {
                axis = new Vector3(0.0, 1.0, 0.0);
            }
            const cross = origN.cross(axis).normalize();
            return Quaternion.fromAngleAxis(Math.PI, cross);
        } else if (dot > 0.999999) {
            return new Quaternion(1.0, 0.0, 0.0, 0.0);
        }

        const s = Math.sqrt((1.0 + dot) * 2.0);
        const invS = 1.0 / s;
        const cross = origN.cross(destN);

        return new Quaternion(
            s * 0.5,
            cross.x * invS,
            cross.y * invS,
            cross.z * invS
        );
    }

    static interpolate(t: number, fromQ: Quaternion, toQ: Quaternion): Quaternion {
        const fromQN = fromQ.normalize();
        const toQN = toQ.normalize();

        let dot = fromQN.dot(toQN);

        if (dot < 0.0) {
            dot = -dot;
        }

        if (dot > 0.9995) {
            const result = new Quaternion(
                fromQN._w + t * (toQN._w - fromQN._w),
                fromQN._x + t * (toQN._x - fromQN._x),
                fromQN._y + t * (toQN._y - fromQN._y),
                fromQN._z + t * (toQN._z - fromQN._z)
            );
            return result.normalize();
        }

        const theta0 = Math.acos(dot);
        const theta = theta0 * t;
        const sinTheta = Math.sin(theta);
        const sinTheta0 = Math.sin(theta0);

        const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
        const s1 = sinTheta / sinTheta0;

        return new Quaternion(
            s0 * fromQN._w + s1 * toQN._w,
            s0 * fromQN._x + s1 * toQN._x,
            s0 * fromQN._y + s1 * toQN._y,
            s0 * fromQN._z + s1 * toQN._z
        );
    }

    static slerp(t: number, v1: Quaternion, v2: Quaternion): Quaternion {
        return Quaternion.interpolate(t, v1, v2);
    }

    __repr__(): string {
        return `Quaternion(${this._w}, ${this._x}, ${this._y}, ${this._z})`;
    }

    equals(other: Quaternion): boolean {
        return this._w === other._w && this._x === other._x && this._y === other._y && this._z === other._z;
    }
}
