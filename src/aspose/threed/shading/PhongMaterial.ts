import { LambertMaterial } from './LambertMaterial';
import { Vector3 } from '../utilities/Vector3';

export class PhongMaterial extends LambertMaterial {
    private _specularColor: Vector3 | null = null;
    private _specularFactor = 0.0;
    private _shininess = 0.0;
    private _reflectionColor: Vector3 | null = null;
    private _reflectionFactor = 0.0;

    constructor(name?: string) {
        super(name);
    }

    get specularColor(): Vector3 | null {
        return this._specularColor;
    }

    set specularColor(value: Vector3 | null) {
        this._specularColor = value;
    }

    get specularFactor(): number {
        return this._specularFactor;
    }

    set specularFactor(value: number) {
        this._specularFactor = parseFloat(value.toString());
    }

    get shininess(): number {
        return this._shininess;
    }

    set shininess(value: number) {
        this._shininess = parseFloat(value.toString());
    }

    get reflectionColor(): Vector3 | null {
        return this._reflectionColor;
    }

    set reflectionColor(value: Vector3 | null) {
        this._reflectionColor = value;
    }

    get reflectionFactor(): number {
        return this._reflectionFactor;
    }

    set reflectionFactor(value: number) {
        this._reflectionFactor = parseFloat(value.toString());
    }
}
