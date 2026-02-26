export class Matrix4 {
    private _m: number[];

    constructor();
    constructor(matrix: number[]);
    constructor(...args: number[]);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._m = [
                1.0, 0.0, 0.0, 0.0,
                0.0, 1.0, 0.0, 0.0,
                0.0, 0.0, 1.0, 0.0,
                0.0, 0.0, 0.0, 1.0
            ];
        } else if (args.length === 1 && Array.isArray(args[0])) {
            const arr = args[0];
            if (arr.length !== 16) {
                throw new Error(`Matrix requires 16 elements, got ${arr.length}`);
            }
            this._m = arr.map(Number);
        } else if (args.length === 16) {
            this._m = args.map(Number);
        } else {
            throw new TypeError(`Invalid number of arguments for Matrix4: ${args.length}`);
        }
    }

    getItem(key: number): number {
        return this._m[key];
    }

    setItem(key: number, value: number): void {
        this._m[key] = Number(value);
    }

    [key: number]: number;

    get m00(): number { return this._m[0]; }
    set m00(value: number) { this._m[0] = Number(value); }

    get m01(): number { return this._m[1]; }
    set m01(value: number) { this._m[1] = Number(value); }

    get m02(): number { return this._m[2]; }
    set m02(value: number) { this._m[2] = Number(value); }

    get m03(): number { return this._m[3]; }
    set m03(value: number) { this._m[3] = Number(value); }

    get m10(): number { return this._m[4]; }
    set m10(value: number) { this._m[4] = Number(value); }

    get m11(): number { return this._m[5]; }
    set m11(value: number) { this._m[5] = Number(value); }

    get m12(): number { return this._m[6]; }
    set m12(value: number) { this._m[6] = Number(value); }

    get m13(): number { return this._m[7]; }
    set m13(value: number) { this._m[7] = Number(value); }

    get m20(): number { return this._m[8]; }
    set m20(value: number) { this._m[8] = Number(value); }

    get m21(): number { return this._m[9]; }
    set m21(value: number) { this._m[9] = Number(value); }

    get m22(): number { return this._m[10]; }
    set m22(value: number) { this._m[10] = Number(value); }

    get m23(): number { return this._m[11]; }
    set m23(value: number) { this._m[11] = Number(value); }

    get m30(): number { return this._m[12]; }
    set m30(value: number) { this._m[12] = Number(value); }

    get m31(): number { return this._m[13]; }
    set m31(value: number) { this._m[13] = Number(value); }

    get m32(): number { return this._m[14]; }
    set m32(value: number) { this._m[14] = Number(value); }

    get m33(): number { return this._m[15]; }
    set m33(value: number) { this._m[15] = Number(value); }

    get determinant(): number {
        const m = this._m;
        return (
            m[0] * (m[5] * m[10] * m[15] + m[6] * m[11] * m[13] + m[7] * m[9] * m[14] -
                m[7] * m[10] * m[13] - m[6] * m[9] * m[15] - m[5] * m[11] * m[14]) -
            m[1] * (m[4] * m[10] * m[15] + m[6] * m[11] * m[12] + m[7] * m[8] * m[14] -
                m[7] * m[10] * m[12] - m[6] * m[8] * m[15] - m[4] * m[11] * m[14]) +
            m[2] * (m[4] * m[9] * m[15] + m[5] * m[11] * m[12] + m[7] * m[8] * m[13] -
                m[7] * m[9] * m[12] - m[5] * m[8] * m[15] - m[4] * m[11] * m[13]) -
            m[3] * (m[4] * m[9] * m[14] + m[5] * m[10] * m[12] + m[6] * m[8] * m[13] -
                m[6] * m[9] * m[12] - m[5] * m[8] * m[14] - m[4] * m[10] * m[13])
        );
    }

    transpose(): Matrix4 {
        return new Matrix4(
            this._m[0], this._m[4], this._m[8], this._m[12],
            this._m[1], this._m[5], this._m[9], this._m[13],
            this._m[2], this._m[6], this._m[10], this._m[14],
            this._m[3], this._m[7], this._m[11], this._m[15]
        );
    }

    concatenate(m2: Matrix4): Matrix4 {
        const result = new Matrix4();
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result._m[i * 4 + j] = (
                    this._m[i * 4 + 0] * m2._m[0 * 4 + j] +
                    this._m[i * 4 + 1] * m2._m[1 * 4 + j] +
                    this._m[i * 4 + 2] * m2._m[2 * 4 + j] +
                    this._m[i * 4 + 3] * m2._m[3 * 4 + j]
                );
            }
        }
        return result;
    }

    normalize(): Matrix4 {
        const m = this._m;
        const scaleX = Math.sqrt(m[0] ** 2 + m[1] ** 2 + m[2] ** 2);
        const scaleY = Math.sqrt(m[4] ** 2 + m[5] ** 2 + m[6] ** 2);
        const scaleZ = Math.sqrt(m[8] ** 2 + m[9] ** 2 + m[10] ** 2);

        if (scaleX === 0 || scaleY === 0 || scaleZ === 0) {
            return new Matrix4(this._m);
        }

        return new Matrix4(
            m[0] / scaleX, m[1] / scaleX, m[2] / scaleX, m[3],
            m[4] / scaleY, m[5] / scaleY, m[6] / scaleY, m[7],
            m[8] / scaleZ, m[9] / scaleZ, m[10] / scaleZ, m[11],
            m[12], m[13], m[14], m[15]
        );
    }

    inverse(): Matrix4 {
        const det = this.determinant;
        if (Math.abs(det) < 1e-10) {
            throw new Error('Matrix is singular and cannot be inverted');
        }

        const invDet = 1.0 / det;
        const m = this._m;

        const inv = new Matrix4();
        inv._m[0] = invDet * (
            m[5] * (m[10] * m[15] - m[11] * m[14]) -
            m[6] * (m[9] * m[15] - m[11] * m[13]) +
            m[7] * (m[9] * m[14] - m[10] * m[13])
        );
        inv._m[1] = -invDet * (
            m[1] * (m[10] * m[15] - m[11] * m[14]) -
            m[2] * (m[9] * m[15] - m[11] * m[13]) +
            m[3] * (m[9] * m[14] - m[10] * m[13])
        );
        inv._m[2] = invDet * (
            m[1] * (m[6] * m[15] - m[7] * m[14]) -
            m[2] * (m[5] * m[15] - m[7] * m[13]) +
            m[3] * (m[5] * m[14] - m[6] * m[13])
        );
        inv._m[3] = -invDet * (
            m[1] * (m[6] * m[11] - m[7] * m[10]) -
            m[2] * (m[5] * m[11] - m[7] * m[9]) +
            m[3] * (m[5] * m[10] - m[6] * m[9])
        );
        inv._m[4] = -invDet * (
            m[4] * (m[10] * m[15] - m[11] * m[14]) -
            m[6] * (m[8] * m[15] - m[11] * m[12]) +
            m[7] * (m[8] * m[14] - m[10] * m[12])
        );
        inv._m[5] = invDet * (
            m[0] * (m[10] * m[15] - m[11] * m[14]) -
            m[2] * (m[8] * m[15] - m[11] * m[12]) +
            m[3] * (m[8] * m[14] - m[10] * m[12])
        );
        inv._m[6] = -invDet * (
            m[0] * (m[6] * m[15] - m[7] * m[14]) -
            m[2] * (m[4] * m[15] - m[7] * m[12]) +
            m[3] * (m[4] * m[14] - m[6] * m[12])
        );
        inv._m[7] = invDet * (
            m[0] * (m[6] * m[11] - m[7] * m[10]) -
            m[2] * (m[4] * m[11] - m[7] * m[8]) +
            m[3] * (m[4] * m[10] - m[6] * m[8])
        );
        inv._m[8] = invDet * (
            m[4] * (m[9] * m[15] - m[11] * m[13]) -
            m[5] * (m[8] * m[15] - m[11] * m[12]) +
            m[7] * (m[8] * m[13] - m[9] * m[12])
        );
        inv._m[9] = -invDet * (
            m[0] * (m[9] * m[15] - m[11] * m[13]) -
            m[1] * (m[8] * m[15] - m[11] * m[12]) +
            m[3] * (m[8] * m[13] - m[9] * m[12])
        );
        inv._m[10] = invDet * (
            m[0] * (m[5] * m[15] - m[7] * m[13]) -
            m[1] * (m[4] * m[15] - m[7] * m[12]) +
            m[3] * (m[4] * m[13] - m[5] * m[12])
        );
        inv._m[11] = -invDet * (
            m[0] * (m[5] * m[11] - m[7] * m[9]) -
            m[1] * (m[4] * m[11] - m[7] * m[8]) +
            m[3] * (m[4] * m[9] - m[5] * m[8])
        );
        inv._m[12] = -invDet * (
            m[4] * (m[9] * m[14] - m[10] * m[13]) -
            m[5] * (m[8] * m[14] - m[10] * m[12]) +
            m[6] * (m[8] * m[13] - m[9] * m[12])
        );
        inv._m[13] = invDet * (
            m[0] * (m[9] * m[14] - m[10] * m[13]) -
            m[1] * (m[8] * m[14] - m[10] * m[12]) +
            m[2] * (m[8] * m[13] - m[9] * m[12])
        );
        inv._m[14] = -invDet * (
            m[0] * (m[5] * m[14] - m[6] * m[13]) -
            m[1] * (m[4] * m[14] - m[6] * m[12]) +
            m[2] * (m[4] * m[13] - m[5] * m[12])
        );
        inv._m[15] = invDet * (
            m[0] * (m[5] * m[10] - m[6] * m[9]) -
            m[1] * (m[4] * m[10] - m[6] * m[8]) +
            m[2] * (m[4] * m[9] - m[5] * m[8])
        );

        return inv;
    }

    decompose(translation: any[], scaling: any[], rotation: any[]): void {
        const m = this._m;

        const scaleX = Math.sqrt(m[0] ** 2 + m[1] ** 2 + m[2] ** 2);
        const scaleY = Math.sqrt(m[4] ** 2 + m[5] ** 2 + m[6] ** 2);
        const scaleZ = Math.sqrt(m[8] ** 2 + m[9] ** 2 + m[10] ** 2);

        if (scaleX < 1e-10) { scaleX = 1.0; }
        if (scaleY < 1e-10) { scaleY = 1.0; }
        if (scaleZ < 1e-10) { scaleZ = 1.0; }

        const rotMat = new Matrix4(
            m[0] / scaleX, m[1] / scaleX, m[2] / scaleX, 0.0,
            m[4] / scaleY, m[5] / scaleY, m[6] / scaleY, 0.0,
            m[8] / scaleZ, m[9] / scaleZ, m[10] / scaleZ, 0.0,
            0.0, 0.0, 0.0, 1.0
        );

        const trace = rotMat[0] + rotMat[5] + rotMat[10];
        let w = 0.0, x = 0.0, y = 0.0, z = 0.0;

        if (trace > 0.0) {
            const s = Math.sqrt(trace + 1.0) * 2.0;
            w = 0.25 * s;
            x = (rotMat[9] - rotMat[6]) / s;
            y = (rotMat[2] - rotMat[8]) / s;
            z = (rotMat[4] - rotMat[1]) / s;
        } else if (rotMat[0] > rotMat[5] && rotMat[0] > rotMat[10]) {
            const s = Math.sqrt(1.0 + rotMat[0] - rotMat[5] - rotMat[10]) * 2.0;
            w = (rotMat[9] - rotMat[6]) / s;
            x = 0.25 * s;
            y = (rotMat[1] + rotMat[4]) / s;
            z = (rotMat[2] + rotMat[8]) / s;
        } else if (rotMat[5] > rotMat[10]) {
            const s = Math.sqrt(1.0 + rotMat[5] - rotMat[0] - rotMat[10]) * 2.0;
            w = (rotMat[2] - rotMat[8]) / s;
            x = (rotMat[1] + rotMat[4]) / s;
            y = 0.25 * s;
            z = (rotMat[6] + rotMat[9]) / s;
        } else {
            const s = Math.sqrt(1.0 + rotMat[10] - rotMat[0] - rotMat[5]) * 2.0;
            w = (rotMat[4] - rotMat[1]) / s;
            x = (rotMat[2] + rotMat[8]) / s;
            y = (rotMat[6] + rotMat[9]) / s;
            z = 0.25 * s;
        }

        translation[0] = { x: m[3], y: m[7], z: m[11] };
        scaling[0] = { x: scaleX, y: scaleY, z: scaleZ };
        rotation[0] = { w, x, y, z };
    }

    setTRS(translation: any, rotation: any, scale: any): void {
        let tx: number, ty: number, tz: number;
        if (typeof translation === 'object' && translation !== null) {
            tx = translation.x;
            ty = translation.y;
            tz = translation.z;
        } else {
            tx = translation[0];
            ty = translation[1];
            tz = translation[2];
        }

        let q = rotation;
        if (typeof rotation === 'object' && rotation !== null && !('w' in rotation)) {
            q = { w: 0, x: rotation.x, y: rotation.y, z: rotation.z };
        } else if (Array.isArray(rotation) && rotation.length >= 3) {
            const rx = rotation[0], ry = rotation[1], rz = rotation[2];
            q = { w: 0, x: 0, y: 0, z: 0 };
        }

        let sx: number, sy: number, sz: number;
        if (typeof scale === 'object' && scale !== null) {
            sx = scale.x;
            sy = scale.y;
            sz = scale.z;
        } else {
            sx = scale[0];
            sy = scale[1];
            sz = scale[2];
        }

        this._m[0] = sx;
        this._m[5] = sy;
        this._m[10] = sz;
        this._m[3] = tx;
        this._m[7] = ty;
        this._m[11] = tz;
        this._m[15] = 1.0;
    }

    toArray(): number[] {
        return [...this._m];
    }

    static get identity(): Matrix4 {
        return new Matrix4();
    }

    static translate(tx: number, ty?: number, tz?: number): Matrix4;
    static translate(v: any): Matrix4;
    static translate(tx: any, ty?: any, tz?: any): Matrix4 {
        if (typeof tx !== 'number') {
            return Matrix4.translate(tx.x, tx.y, tx.z);
        }
        ty = ty !== undefined ? ty : tx;
        tz = tz !== undefined ? tz : tx;
        return new Matrix4(
            1.0, 0.0, 0.0, Number(tx),
            0.0, 1.0, 0.0, Number(ty),
            0.0, 0.0, 1.0, Number(tz),
            0.0, 0.0, 0.0, 1.0
        );
    }

    static scale(sx: number, sy?: number, sz?: number): Matrix4;
    static scale(v: any): Matrix4;
    static scale(sx: any, sy?: any, sz?: any): Matrix4 {
        if (typeof sx !== 'number') {
            return Matrix4.scale(sx.x, sx.y, sx.z);
        }
        sy = sy !== undefined ? sy : sx;
        sz = sz !== undefined ? sz : sx;
        return new Matrix4(
            Number(sx), 0.0, 0.0, 0.0,
            0.0, Number(sy), 0.0, 0.0,
            0.0, 0.0, Number(sz), 0.0,
            0.0, 0.0, 0.0, 1.0
        );
    }

    static rotateFromEuler(rx: number, ry?: number, rz?: number): Matrix4;
    static rotateFromEuler(v: any): Matrix4;
    static rotateFromEuler(rx: any, ry?: any, rz?: any): Matrix4 {
        let angles: any;
        if (typeof rx === 'number') {
            angles = { x: rx, y: ry, z: rz };
        } else {
            angles = rx;
        }

        const q = Quaternion.fromEulerAngle(angles.x, angles.y, angles.z);
        return q.toMatrix();
    }

    static rotate(angle: number, axis?: any): Matrix4;
    static rotate(q: Quaternion): Matrix4;
    static rotate(angle: any, axis?: any): Matrix4 {
        if (angle instanceof Quaternion) {
            return angle.toMatrix();
        }
        if (axis === undefined) {
            throw new TypeError('axis must be specified with angle');
        }
        const q = Quaternion.fromAngleAxis(Number(angle), axis);
        return q.toMatrix();
    }

    toString(): string {
        return `Matrix4(${this._m})`;
    }

    equals(other: Matrix4): boolean {
        return this._m.every((val, idx) => val === other._m[idx]);
    }
}
