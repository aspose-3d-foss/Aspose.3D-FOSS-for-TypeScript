import { Material } from './Material';
import { Vector3 } from '../utilities/Vector3';
import { TextureBase } from './TextureBase';

export class PbrMaterial extends Material {
    private _albedo: Vector3 | null = null;
    private _albedoTexture: TextureBase | null = null;
    private _normalTexture: TextureBase | null = null;
    private _metallicFactor = 0.0;
    private _roughnessFactor = 0.0;
    private _metallicRoughness: TextureBase | null = null;
    private _occlusionTexture: TextureBase | null = null;
    private _occlusionFactor = 0.0;
    private _emissiveTexture: TextureBase | null = null;
    private _emissiveColor: Vector3 | null = null;
    private _transparency = 0.0;

    constructor(name?: string | null, albedo?: Vector3 | null) {
        super(name ?? undefined);
        this._albedo = albedo ?? null;
    }

    get albedo(): Vector3 | null {
        return this._albedo;
    }

    set albedo(value: Vector3 | null) {
        this._albedo = value;
    }

    get albedoTexture(): TextureBase | null {
        return this._albedoTexture;
    }

    set albedoTexture(value: TextureBase | null) {
        this._albedoTexture = value;
    }

    get normalTexture(): TextureBase | null {
        return this._normalTexture;
    }

    set normalTexture(value: TextureBase | null) {
        this._normalTexture = value;
    }

    get metallicFactor(): number {
        return this._metallicFactor;
    }

    set metallicFactor(value: number) {
        this._metallicFactor = parseFloat(value.toString());
    }

    get roughnessFactor(): number {
        return this._roughnessFactor;
    }

    set roughnessFactor(value: number) {
        this._roughnessFactor = parseFloat(value.toString());
    }

    get metallicRoughness(): TextureBase | null {
        return this._metallicRoughness;
    }

    set metallicRoughness(value: TextureBase | null) {
        this._metallicRoughness = value;
    }

    get occlusionTexture(): TextureBase | null {
        return this._occlusionTexture;
    }

    set occlusionTexture(value: TextureBase | null) {
        this._occlusionTexture = value;
    }

    get occlusionFactor(): number {
        return this._occlusionFactor;
    }

    set occlusionFactor(value: number) {
        this._occlusionFactor = parseFloat(value.toString());
    }

    get emissiveTexture(): TextureBase | null {
        return this._emissiveTexture;
    }

    set emissiveTexture(value: TextureBase | null) {
        this._emissiveTexture = value;
    }

    get emissiveColor(): Vector3 | null {
        return this._emissiveColor;
    }

    set emissiveColor(value: Vector3 | null) {
        this._emissiveColor = value;
    }

    get transparency(): number {
        return this._transparency;
    }

    set transparency(value: number) {
        this._transparency = Math.max(0.0, Math.min(1.0, parseFloat(value.toString())));
    }

    static fromMaterial(material: Material): PbrMaterial {
        return new PbrMaterial(material ? material.name : undefined);
    }
}
