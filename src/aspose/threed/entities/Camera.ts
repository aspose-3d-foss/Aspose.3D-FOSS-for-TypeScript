import { Entity } from '../Entity';
import { Property } from '../Property';

export class Camera extends Entity {
    private _projectionType: string = 'PERSPECTIVE';

    constructor(name: string | null = null, projectionType: any = null) {
        super(name ?? '');
        this._projectionType = projectionType ? projectionType : 'PERSPECTIVE';
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = String(value);
    }

    get parentNodes(): any[] {
        return [];
    }

    get excluded(): boolean {
        return false;
    }

    set excluded(_value: boolean) {
    }

    get parentNode(): any {
        return null;
    }

    set parentNode(_value: any) {
    }

    get rotationMode(): any {
        return null;
    }

    set rotationMode(_value: any) {
    }

    get nearPlane(): number {
        return 0.1;
    }

    set nearPlane(_value: number) {
    }

    get farPlane(): number {
        return 1000.0;
    }

    set farPlane(_value: number) {
    }

    get aspect(): number {
        return 1.0;
    }

    set aspect(_value: number) {
    }

    get orthoHeight(): number {
        return 100.0;
    }

    set orthoHeight(_value: number) {
    }

    get up(): any {
        return null;
    }

    set up(_value: any) {
    }

    get lookAt(): any {
        return null;
    }

    set lookAt(_value: any) {
    }

    get direction(): any {
        return null;
    }

    set direction(_value: any) {
    }

    get target(): any {
        return null;
    }

    set target(_value: any) {
    }

    get apertureMode(): any {
        return null;
    }

    set apertureMode(_value: any) {
    }

    get fieldOfView(): number {
        return 0.0;
    }

    set fieldOfView(_value: number) {
    }

    get fieldOfViewX(): number {
        return 0.0;
    }

    set fieldOfViewX(_value: number) {
    }

    get fieldOfViewY(): number {
        return 0.0;
    }

    set fieldOfViewY(_value: number) {
    }

    get width(): number {
        return 0.0;
    }

    set width(_value: number) {
    }

    get height(): number {
        return 0.0;
    }

    set height(_value: number) {
    }

    get aspectRatio(): number {
        return 1.0;
    }

    set aspectRatio(_value: number) {
    }

    get magnification(): any {
        return null;
    }

    set magnification(_value: any) {
    }

    get projectionType(): string {
        return this._projectionType;
    }

    set projectionType(value: string) {
        this._projectionType = value;
    }

    moveForward(_distance: number): void {
    }

    getBoundingBox(): any {
        return null;
    }

    getEntityRendererKey(): any {
        throw new Error('get_entity_renderer_key is not implemented for Camera');
    }

    removeProperty(_prop: Property | string): boolean {
        return false;
    }

    getProperty(_property: string): any {
        return null;
    }

    setProperty(_property: string, _value: any): void {
    }

    findProperty(_property: string): Property | null {
        return null;
    }
}
