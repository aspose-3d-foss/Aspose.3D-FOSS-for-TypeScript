import { Matrix4 } from './Matrix4';
import { ComposeOrder } from './ComposeOrder';
import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';
import { RotationOrder } from './RotationOrder';
import { Axis } from '../Axis';

export class TransformBuilder {
    private _matrix: Matrix4;
    private _composeOrder: ComposeOrder;
    private _transformChain: Matrix4[] = [];

    constructor();
    constructor(initial: Matrix4, order: ComposeOrder);
    constructor(order: ComposeOrder);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._matrix = Matrix4.identity;
            this._composeOrder = ComposeOrder.APPEND;
        } else if (args.length === 1) {
            this._matrix = Matrix4.identity;
            this._composeOrder = args[0];
        } else if (args.length === 2) {
            this._matrix = args[0];
            this._composeOrder = args[1];
        }
    }

    scale(s: number): TransformBuilder;
    scale(x: number, y: number, z: number): TransformBuilder;
    scale(s: Vector3): TransformBuilder;
    scale(...args: any[]): TransformBuilder {
        let sx, sy, sz;
        if (args.length === 1) {
            if (typeof args[0] === 'number') {
                sx = sy = sz = args[0];
            } else if (args[0] instanceof Vector3) {
                sx = args[0].x;
                sy = args[0].y;
                sz = args[0].z;
            }
        } else if (args.length === 3) {
            sx = args[0];
            sy = args[1];
            sz = args[2];
        }

        const scaleMatrix = new Matrix4(
            sx, 0, 0, 0,
            0, sy, 0, 0,
            0, 0, sz, 0,
            0, 0, 0, 1
        );

        return this.append(scaleMatrix);
    }

    rotateDegree(angle: number, axis: Vector3): TransformBuilder;
    rotateDegree(rot: Vector3, order: RotationOrder): void;
    rotateDegree(...args: any[]): TransformBuilder | void {
        const angle = Number(args[0]);
        const axis = args[1] instanceof Vector3 ? args[1] : null;
        const order = args[1] instanceof RotationOrder ? args[1] : null;

        if (axis !== null) {
            const radian = (angle * Math.PI) / 180.0;
            const halfAngle = radian * 0.5;
            const s = Math.sin(halfAngle);
            const q = new Quaternion(Math.cos(halfAngle), axis.x * s, axis.y * s, axis.z * s);
            const rotationMatrix = q.toMatrix();
            return this.append(rotationMatrix);
        } else if (order !== null) {
            this.rotateRadian(args[0], order);
            return;
        }
    }

    rotateRadian(angle: number, axis: Vector3): TransformBuilder;
    rotateRadian(rot: Vector3, order: RotationOrder): void;
    rotateRadian(...args: any[]): TransformBuilder | void {
        const angle = Number(args[0]);
        const axis = args[1] instanceof Vector3 ? args[1] : null;
        const order = args[1] instanceof RotationOrder ? args[1] : null;

        if (axis !== null) {
            const halfAngle = angle * 0.5;
            const s = Math.sin(halfAngle);
            const q = new Quaternion(Math.cos(halfAngle), axis.x * s, axis.y * s, axis.z * s);
            const rotationMatrix = q.toMatrix();
            return this.append(rotationMatrix);
        } else if (order !== null) {
            const rads = new Vector3(
                (args[0].x * Math.PI) / 180.0,
                (args[0].y * Math.PI) / 180.0,
                (args[0].z * Math.PI) / 180.0
            );
            const q = Quaternion.fromEulerAngle(rads);
            const rotationMatrix = q.toMatrix();
            this.compose(rotationMatrix);
        }
    }

    rotateEulerRadian(x: number, y: number, z: number): TransformBuilder;
    rotateEulerRadian(r: Vector3): TransformBuilder;
    rotateEulerRadian(...args: any[]): TransformBuilder {
        let rx, ry, rz;
        if (args.length === 1) {
            rx = args[0].x;
            ry = args[0].y;
            rz = args[0].z;
        } else {
            rx = args[0];
            ry = args[1];
            rz = args[2];
        }

        const q = Quaternion.fromEulerAngle(rx, ry, rz);
        const rotationMatrix = q.toMatrix();
        return this.append(rotationMatrix);
    }

    translate(tx: number, ty: number, tz: number): TransformBuilder;
    translate(v: Vector3): TransformBuilder;
    translate(...args: any[]): TransformBuilder {
        let tx, ty, tz;
        if (args.length === 1) {
            tx = args[0].x;
            ty = args[0].y;
            tz = args[0].z;
        } else {
            tx = args[0];
            ty = args[1];
            tz = args[2];
        }

        const translationMatrix = new Matrix4(
            1, 0, 0, tx,
            0, 1, 0, ty,
            0, 0, 1, tz,
            0, 0, 0, 1
        );

        return this.append(translationMatrix);
    }

    compose(m: Matrix4): void {
        if (this._composeOrder === ComposeOrder.APPEND) {
            this._matrix = this._matrix.concatenate(m);
        } else {
            this._matrix = m.concatenate(this._matrix);
        }
    }

    append(m: Matrix4): TransformBuilder {
        this._matrix = this._matrix.concatenate(m);
        return this;
    }

    prepend(m: Matrix4): TransformBuilder {
        this._matrix = m.concatenate(this._matrix);
        return this;
    }

    rearrange(newX: Axis, newY: Axis, newZ: Axis): TransformBuilder {
        const axisMap: { [key: string]: Vector3 } = {
            POSITIVE_X: new Vector3(1, 0, 0),
            NEGATIVE_X: new Vector3(-1, 0, 0),
            POSITIVE_Y: new Vector3(0, 1, 0),
            NEGATIVE_Y: new Vector3(0, -1, 0),
            POSITIVE_Z: new Vector3(0, 0, 1),
            NEGATIVE_Z: new Vector3(0, 0, -1)
        };

        const xAxis = axisMap[newX.toString()] || new Vector3(1, 0, 0);
        const yAxis = axisMap[newY.toString()] || new Vector3(0, 1, 0);
        const zAxis = axisMap[newZ.toString()] || new Vector3(0, 0, 1);

        const rearrangeMatrix = new Matrix4(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            0, 0, 0, 1
        );

        return this.append(rearrangeMatrix);
    }

    rotate(q: Quaternion): TransformBuilder {
        const rotationMatrix = q.toMatrix();
        return this.append(rotationMatrix);
    }

    rotateEulerDegree(degX: number, degY: number, degZ: number): TransformBuilder {
        const rads = new Vector3(
            (degX * Math.PI) / 180.0,
            (degY * Math.PI) / 180.0,
            (degZ * Math.PI) / 180.0
        );
        const q = Quaternion.fromEulerAngle(rads);
        const rotationMatrix = q.toMatrix();
        return this.append(rotationMatrix);
    }

    reset(): void {
        this._matrix = Matrix4.identity;
        this._transformChain = [];
    }

    get matrix(): Matrix4 {
        return this._matrix;
    }

    set matrix(value: Matrix4) {
        this._matrix = value;
    }

    get composeOrder(): ComposeOrder {
        return this._composeOrder;
    }

    set composeOrder(value: ComposeOrder) {
        this._composeOrder = value;
    }
}
