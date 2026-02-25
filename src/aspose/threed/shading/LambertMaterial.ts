import { Material } from './Material';
import { Vector3 } from '../../utilities/Vector3';

export class LambertMaterial extends Material {
    static MAP_SPECULAR = 'Specular';
    static MAP_DIFFUSE = 'Diffuse';
    static MAP_EMISSIVE = 'Emissive';
    static MAP_AMBIENT = 'Ambient';
    static MAP_NORMAL = 'Normal';

    private _emissiveColor: Vector3 = null;
    private _ambientColor: Vector3 = null;
    private _diffuseColor: Vector3 = null;
    private _transparentColor: Vector3 = null;
    private _transparency = 0.0;

    constructor(name: string = null) {
        super(name);
    }

    get emissiveColor(): Vector3 {
        return this._emissiveColor;
    }

    set emissiveColor(value: Vector3) {
        this._emissiveColor = value;
    }

    get ambientColor(): Vector3 {
        return this._ambientColor;
    }

    set ambientColor(value: Vector3) {
        this._ambientColor = value;
    }

    get diffuseColor(): Vector3 {
        return this._diffuseColor;
    }

    set diffuseColor(value: Vector3) {
        this._diffuseColor = value;
    }

    get transparentColor(): Vector3 {
        return this._transparentColor;
    }

    set transparentColor(value: Vector3) {
        this._transparentColor = value;
    }

    get transparency(): number {
        return this._transparency;
    }

    set transparency(value: number) {
        this._transparency = Math.max(0.0, Math.min(1.0, parseFloat(value.toString())));
    }
}
