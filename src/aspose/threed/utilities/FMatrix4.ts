import { Matrix4 } from './Matrix4';
import { FVector2 } from './FVector2';
import { FVector3 } from './FVector3';
import { FVector4 } from './FVector4';

export class FMatrix4 {
    private _m: Float32Array;

    constructor();
    constructor(m00: number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number);
    constructor(mat: Matrix4);
    constructor(r0: FVector4, r1: FVector4, r2: FVector4, r3: FVector4);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._m = new Float32Array([
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ]);
        } else if (args.length === 16) {
            this._m = new Float32Array(args.map(Number));
        } else if (args.length === 1 && args[0] instanceof Matrix4) {
            this._m = new Float32Array(16);
            const mat = args[0];
            for (let i = 0; i < 16; i++) {
                this._m[i] = mat.getItem(i);
            }
        } else if (args.length === 1 && args[0] instanceof FVector4 && args[1] instanceof FVector4 && args[2] instanceof FVector4 && args[3] instanceof FVector4) {
            const r0 = args[0], r1 = args[1], r2 = args[2], r3 = args[3];
            this._m = new Float32Array([
                r0.x, r0.y, r0.z, r0.w,
                r1.x, r1.y, r1.z, r1.w,
                r2.x, r2.y, r2.z, r2.w,
                r3.x, r3.y, r3.z, r3.w
            ]);
        } else {
            throw new TypeError(`Invalid arguments for FMatrix4: ${args.length}`);
        }
    }

    concatenate(m2: FMatrix4): FMatrix4;
    concatenate(m2: Matrix4): FMatrix4;
    concatenate(m2: any): FMatrix4 {
        const result = new FMatrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let sum = 0.0;
                for (let k = 0; k < 4; k++) {
                    sum += this._m[i * 4 + k] * (m2._m ? m2._m[k * 4 + j] : m2.getItem(k * 4 + j));
                }
                result._m[i * 4 + j] = sum;
            }
        }
        return result;
    }

    transpose(): FMatrix4 {
        return new FMatrix4(
            this._m[0], this._m[4], this._m[8], this._m[12],
            this._m[1], this._m[5], this._m[9], this._m[13],
            this._m[2], this._m[6], this._m[10], this._m[14],
            this._m[3], this._m[7], this._m[11], this._m[15]
        );
    }

    inverse(): FMatrix4 {
        const invDet = this._determinant();
        if (Math.abs(invDet) < 1e-10) {
            throw new Error('Matrix is singular and cannot be inverted');
        }

        const m = this._m;
        const inv = new Float32Array(16);

        inv[0] = (m[5] * (m[10] * m[15] - m[11] * m[14]) - m[6] * (m[9] * m[15] - m[11] * m[13]) + m[7] * (m[9] * m[14] - m[10] * m[13])) * invDet;
        inv[1] = -(m[1] * (m[10] * m[15] - m[11] * m[14]) - m[2] * (m[9] * m[15] - m[11] * m[13]) + m[3] * (m[9] * m[14] - m[10] * m[13])) * invDet;
        inv[2] = (m[1] * (m[6] * m[15] - m[7] * m[14]) - m[2] * (m[5] * m[15] - m[7] * m[13]) + m[3] * (m[5] * m[14] - m[6] * m[13])) * invDet;
        inv[3] = -(m[1] * (m[6] * m[11] - m[7] * m[10]) - m[2] * (m[5] * m[11] - m[7] * m[9]) + m[3] * (m[5] * m[10] - m[6] * m[9])) * invDet;
        inv[4] = -(m[4] * (m[10] * m[15] - m[11] * m[14]) - m[6] * (m[8] * m[15] - m[11] * m[12]) + m[7] * (m[8] * m[14] - m[10] * m[12])) * invDet;
        inv[5] = (m[0] * (m[10] * m[15] - m[11] * m[14]) - m[2] * (m[8] * m[15] - m[11] * m[12]) + m[3] * (m[8] * m[14] - m[10] * m[12])) * invDet;
        inv[6] = -(m[0] * (m[6] * m[15] - m[7] * m[14]) - m[2] * (m[4] * m[15] - m[7] * m[12]) + m[3] * (m[4] * m[14] - m[6] * m[12])) * invDet;
        inv[7] = (m[0] * (m[6] * m[11] - m[7] * m[10]) - m[2] * (m[4] * m[11] - m[7] * m[8]) + m[3] * (m[4] * m[10] - m[6] * m[8])) * invDet;
        inv[8] = (m[4] * (m[9] * m[15] - m[11] * m[13]) - m[5] * (m[8] * m[15] - m[11] * m[12]) + m[7] * (m[8] * m[13] - m[9] * m[12])) * invDet;
        inv[9] = -(m[0] * (m[9] * m[15] - m[11] * m[13]) - m[1] * (m[8] * m[15] - m[11] * m[12]) + m[3] * (m[8] * m[13] - m[9] * m[12])) * invDet;
        inv[10] = (m[0] * (m[5] * m[15] - m[7] * m[13]) - m[1] * (m[4] * m[15] - m[7] * m[12]) + m[3] * (m[4] * m[13] - m[5] * m[12])) * invDet;
        inv[11] = -(m[0] * (m[5] * m[11] - m[7] * m[9]) - m[1] * (m[4] * m[11] - m[7] * m[8]) + m[3] * (m[4] * m[9] - m[5] * m[8])) * invDet;
        inv[12] = -(m[4] * (m[9] * m[14] - m[10] * m[13]) - m[5] * (m[8] * m[14] - m[10] * m[12]) + m[6] * (m[8] * m[13] - m[9] * m[12])) * invDet;
        inv[13] = (m[0] * (m[9] * m[14] - m[10] * m[13]) - m[1] * (m[8] * m[14] - m[10] * m[12]) + m[2] * (m[8] * m[13] - m[9] * m[12])) * invDet;
        inv[14] = -(m[0] * (m[5] * m[14] - m[6] * m[13]) - m[1] * (m[4] * m[14] - m[6] * m[12]) + m[2] * (m[4] * m[13] - m[5] * m[12])) * invDet;
        inv[15] = (m[0] * (m[5] * m[10] - m[6] * m[9]) - m[1] * (m[4] * m[10] - m[6] * m[8]) + m[2] * (m[4] * m[9] - m[5] * m[8])) * invDet;

        return new FMatrix4(inv[0], inv[1], inv[2], inv[3], inv[4], inv[5], inv[6], inv[7], inv[8], inv[9], inv[10], inv[11], inv[12], inv[13], inv[14], inv[15]);
    }

    get identity(): FMatrix4 {
        return new FMatrix4();
    }

    get m00(): number { return this._m[0]; }
    set m00(value: number) { this._m[0] = value; }

    get m01(): number { return this._m[1]; }
    set m01(value: number) { this._m[1] = value; }

    get m02(): number { return this._m[2]; }
    set m02(value: number) { this._m[2] = value; }

    get m03(): number { return this._m[3]; }
    set m03(value: number) { this._m[3] = value; }

    get m10(): number { return this._m[4]; }
    set m10(value: number) { this._m[4] = value; }

    get m11(): number { return this._m[5]; }
    set m11(value: number) { this._m[5] = value; }

    get m12(): number { return this._m[6]; }
    set m12(value: number) { this._m[6] = value; }

    get m13(): number { return this._m[7]; }
    set m13(value: number) { this._m[7] = value; }

    get m20(): number { return this._m[8]; }
    set m20(value: number) { this._m[8] = value; }

    get m21(): number { return this._m[9]; }
    set m21(value: number) { this._m[9] = value; }

    get m22(): number { return this._m[10]; }
    set m22(value: number) { this._m[10] = value; }

    get m23(): number { return this._m[11]; }
    set m23(value: number) { this._m[11] = value; }

    get m30(): number { return this._m[12]; }
    set m30(value: number) { this._m[12] = value; }

    get m31(): number { return this._m[13]; }
    set m31(value: number) { this._m[13] = value; }

    get m32(): number { return this._m[14]; }
    set m32(value: number) { this._m[14] = value; }

    get m33(): number { return this._m[15]; }
    set m33(value: number) { this._m[15] = value; }

    private _determinant(): number {
        const m = this._m;
        return (
            m[0] * (m[5] * m[10] * m[15] + m[6] * m[11] * m[13] + m[7] * m[9] * m[14] - m[7] * m[10] * m[13] - m[6] * m[9] * m[15] - m[5] * m[11] * m[14]) -
            m[1] * (m[4] * m[10] * m[15] + m[6] * m[11] * m[12] + m[7] * m[8] * m[14] - m[7] * m[10] * m[12] - m[6] * m[8] * m[15] - m[4] * m[11] * m[14]) +
            m[2] * (m[4] * m[9] * m[15] + m[5] * m[11] * m[12] + m[7] * m[8] * m[13] - m[7] * m[9] * m[12] - m[5] * m[8] * m[15] - m[4] * m[11] * m[13]) -
            m[3] * (m[4] * m[9] * m[14] + m[5] * m[10] * m[12] + m[6] * m[8] * m[13] - m[6] * m[9] * m[12] - m[5] * m[8] * m[14] - m[4] * m[10] * m[13])
        ) * 1.0;
    }
}
