import { Matrix4 } from '../utilities/Matrix4';
import { Vector3 } from '../utilities/Vector3';
import { Quaternion } from '../utilities/Quaternion';

export class GlobalTransform {
    private _matrix: Matrix4;
    private _translation: Vector3;
    private _scale: Vector3;
    private _rotation: Quaternion;

    constructor(matrix: Matrix4) {
        this._matrix = matrix;
        const translation: any[] = [null];
        const scaling: any[] = [null];
        const rotation: any[] = [null];
        matrix.decompose(translation, scaling, rotation);
        this._translation = translation[0];
        this._scale = scaling[0];
        this._rotation = rotation[0];
    }

    get translation(): Vector3 {
        return this._translation;
    }

    get scale(): Vector3 {
        return this._scale;
    }

    get eulerAngles(): Vector3 {
        return this._rotation.eulerAngles();
    }

    get rotation(): Quaternion {
        return this._rotation;
    }

    get transformMatrix(): Matrix4 {
        return this._matrix;
    }

    __repr__(): string {
        return `GlobalTransform(translation=${this._translation.__repr__()}, scale=${this._scale.__repr__()})`;
    }
}
