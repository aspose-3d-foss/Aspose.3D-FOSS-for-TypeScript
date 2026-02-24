import { A3DObject } from '../A3DObject';
import { Vector3 } from '../utilities/Vector3';
import { Quaternion } from '../utilities/Quaternion';
import { Matrix4 } from '../utilities/Matrix4';

export class Transform extends A3DObject {
    private _translation: Vector3 = new Vector3(0, 0, 0);
    private _scaling: Vector3 = new Vector3(1, 1, 1);
    private _rotation: Quaternion = new Quaternion(1, 0, 0, 0);
    private _eulerAngles: Vector3 = new Vector3(0, 0, 0);
    private _scalingOffset: Vector3 = new Vector3(0, 0, 0);
    private _scalingPivot: Vector3 = new Vector3(0, 0, 0);
    private _rotationOffset: Vector3 = new Vector3(0, 0, 0);
    private _rotationPivot: Vector3 = new Vector3(0, 0, 0);
    private _preRotation: Vector3 = new Vector3(0, 0, 0);
    private _postRotation: Vector3 = new Vector3(0, 0, 0);
    private _geometricTranslation: Vector3 = new Vector3(0, 0, 0);
    private _geometricScaling: Vector3 = new Vector3(1, 1, 1);
    private _geometricRotation: Vector3 = new Vector3(0, 0, 0);
    private _cachedMatrix: Matrix4 | null = null;

    constructor(name?: string) {
        super(name);
    }

    get translation(): Vector3 {
        return this._translation;
    }

    set translation(value: Vector3) {
        this._translation = value;
        this._invalidateCache();
    }

    get scaling(): Vector3 {
        return this._scaling;
    }

    set scaling(value: Vector3) {
        this._scaling = value;
        this._invalidateCache();
    }

    get rotation(): Quaternion {
        return this._rotation;
    }

    set rotation(value: Quaternion) {
        this._rotation = value;
        this._eulerAngles = value.eulerAngles();
        this._invalidateCache();
    }

    get eulerAngles(): Vector3 {
        return this._eulerAngles;
    }

    set eulerAngles(value: Vector3) {
        this._eulerAngles = value;
        this._rotation = Quaternion.fromEulerAngle(value);
        this._invalidateCache();
    }

    get scalingOffset(): Vector3 {
        return this._scalingOffset;
    }

    set scalingOffset(value: Vector3) {
        this._scalingOffset = value;
        this._invalidateCache();
    }

    get scalingPivot(): Vector3 {
        return this._scalingPivot;
    }

    set scalingPivot(value: Vector3) {
        this._scalingPivot = value;
        this._invalidateCache();
    }

    get rotationOffset(): Vector3 {
        return this._rotationOffset;
    }

    set rotationOffset(value: Vector3) {
        this._rotationOffset = value;
        this._invalidateCache();
    }

    get rotationPivot(): Vector3 {
        return this._rotationPivot;
    }

    set rotationPivot(value: Vector3) {
        this._rotationPivot = value;
        this._invalidateCache();
    }

    get preRotation(): Vector3 {
        return this._preRotation;
    }

    set preRotation(value: Vector3) {
        this._preRotation = value;
        this._invalidateCache();
    }

    get postRotation(): Vector3 {
        return this._postRotation;
    }

    set postRotation(value: Vector3) {
        this._postRotation = value;
        this._invalidateCache();
    }

    get geometricTranslation(): Vector3 {
        return this._geometricTranslation;
    }

    set geometricTranslation(value: Vector3) {
        this._geometricTranslation = value;
        this._invalidateCache();
    }

    get geometricScaling(): Vector3 {
        return this._geometricScaling;
    }

    set geometricScaling(value: Vector3) {
        this._geometricScaling = value;
        this._invalidateCache();
    }

    get geometricRotation(): Vector3 {
        return this._geometricRotation;
    }

    set geometricRotation(value: Vector3) {
        this._geometricRotation = value;
        this._invalidateCache();
    }

    get transformMatrix(): Matrix4 {
        if (this._cachedMatrix === null) {
            this._cachedMatrix = this._computeMatrix();
        }
        return this._cachedMatrix;
    }

    set transformMatrix(value: Matrix4) {
        const translation: any[] = [null];
        const scaling: any[] = [null];
        const rotation: any[] = [null];
        value.decompose(translation, scaling, rotation);
        this._translation = translation[0];
        this._scaling = scaling[0];
        this._rotation = rotation[0];
        this._eulerAngles = rotation[0].eulerAngles();
        this._invalidateCache();
    }

    _computeMatrix(): Matrix4 {
        const translationMat = Matrix4.translate(this._translation);
        const scalingMat = Matrix4.scale(this._scaling);
        const scalingOffsetMat = Matrix4.translate(this._scalingOffset);
        const scalingPivotMat = Matrix4.translate(this._scalingPivot);
        const scalingPivotInvMat = Matrix4.translate(-this._scalingPivot.x, -this._scalingPivot.y, -this._scalingPivot.z);

        const rotationMat = this._rotation.toMatrix();
        const rotationOffsetMat = Matrix4.translate(this._rotationOffset);
        const rotationPivotMat = Matrix4.translate(this._rotationPivot);
        const rotationPivotInvMat = Matrix4.translate(-this._rotationPivot.x, -this._rotationPivot.y, -this._rotationPivot.z);

        const preRotMat = Matrix4.rotateFromEuler(this._preRotation);
        const postRotMat = Matrix4.rotateFromEuler(this._postRotation);

        const geoTransMat = Matrix4.translate(this._geometricTranslation);
        const geoScaleMat = Matrix4.scale(this._geometricScaling);
        const geoRotMat = Matrix4.rotateFromEuler(this._geometricRotation);

        const scalePart = scalingOffsetMat.concatenate(scalingMat).concatenate(scalingPivotInvMat);
        const finalScalePart = scalePart.concatenate(scalingPivotMat);

        const rotationPart = rotationOffsetMat.concatenate(rotationMat).concatenate(rotationPivotInvMat);
        let finalRotationPart = preRotMat.concatenate(rotationPart).concatenate(rotationPivotMat);
        finalRotationPart = finalRotationPart.concatenate(postRotMat);

        const geometricPart = geoRotMat.concatenate(geoScaleMat).concatenate(geoTransMat);

        const result = translationMat.concatenate(finalScalePart).concatenate(finalRotationPart).concatenate(geometricPart);

        return result;
    }

    _invalidateCache(): void {
        this._cachedMatrix = null;
    }

    setTranslation(tx: number, ty: number, tz: number): Transform {
        this._translation = new Vector3(Number(tx), Number(ty), Number(tz));
        this._invalidateCache();
        return this;
    }

    setScale(sx: number, sy: number, sz: number): Transform {
        this._scaling = new Vector3(Number(sx), Number(sy), Number(sz));
        this._invalidateCache();
        return this;
    }

    setEulerAngles(rx: number, ry: number, rz: number): Transform {
        this._eulerAngles = new Vector3(Number(rx), Number(ry), Number(rz));
        this._rotation = Quaternion.fromEulerAngle(this._eulerAngles);
        this._invalidateCache();
        return this;
    }

    setRotation(rw: number, rx: number, ry: number, rz: number): Transform {
        this._rotation = new Quaternion(Number(rw), Number(rx), Number(ry), Number(rz));
        this._eulerAngles = this._rotation.eulerAngles();
        this._invalidateCache();
        return this;
    }

    setPreRotation(rx: number, ry: number, rz: number): Transform {
        this._preRotation = new Vector3(Number(rx), Number(ry), Number(rz));
        this._invalidateCache();
        return this;
    }

    setPostRotation(rx: number, ry: number, rz: number): Transform {
        this._postRotation = new Vector3(Number(rx), Number(ry), Number(rz));
        this._invalidateCache();
        return this;
    }

    setGeometricTranslation(x: number, y: number, z: number): Transform {
        this._geometricTranslation = new Vector3(Number(x), Number(y), Number(z));
        this._invalidateCache();
        return this;
    }

    setGeometricScaling(sx: number, sy: number, sz: number): Transform {
        this._geometricScaling = new Vector3(Number(sx), Number(sy), Number(sz));
        this._invalidateCache();
        return this;
    }

    setGeometricRotation(rx: number, ry: number, rz: number): Transform {
        this._geometricRotation = new Vector3(Number(rx), Number(ry), Number(rz));
        this._invalidateCache();
        return this;
    }

    __repr__(): string {
        return `Transform(translation=${this._translation.__repr__()})`;
    }
}
