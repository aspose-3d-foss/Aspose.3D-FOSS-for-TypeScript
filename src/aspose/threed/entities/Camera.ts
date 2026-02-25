import { Entity } from '../Entity';
import { Property } from '../Property';
import { PropertyCollection } from '../PropertyCollection';
import { Scene } from '../Scene';

export class Camera extends Entity {
    private _projectionType: string = 'PERSPECTIVE';
    private _apertureMode: any = null;

    constructor(name: string = null, projectionType: any = null) {
        super(name);
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

    set excluded(value: boolean) {
    }

    get parentNode(): any {
        return null;
    }

    set parentNode(value: any) {
    }

    get rotationMode(): any {
        return null;
    }

    set rotationMode(value: any) {
    }

    get nearPlane(): number {
        return 0.1;
    }

    set nearPlane(value: number) {
    }

    get farPlane(): number {
        return 1000.0;
    }

    set farPlane(value: number) {
    }

    get aspect(): number {
        return 1.0;
    }

    set aspect(value: number) {
    }

    get orthoHeight(): number {
        return 100.0;
    }

    set orthoHeight(value: number) {
    }

    get up(): any {
        return null;
    }

    set up(value: any) {
    }

    get lookAt(): any {
        return null;
    }

    set lookAt(value: any) {
    }

    get direction(): any {
        return null;
    }

    set direction(value: any) {
    }

    get target(): any {
        return null;
    }

    set target(value: any) {
    }

    get apertureMode(): any {
        return null;
    }

    set apertureMode(value: any) {
    }

    get fieldOfView(): number {
        return 0.0;
    }

    set fieldOfView(value: number) {
    }

    get fieldOfViewX(): number {
        return 0.0;
    }

    set fieldOfViewX(value: number) {
    }

    get fieldOfViewY(): number {
        return 0.0;
    }

    set fieldOfViewY(value: number) {
    }

    get width(): number {
        return 0.0;
    }

    set width(value: number) {
    }

    get height(): number {
        return 0.0;
    }

    set height(value: number) {
    }

    get aspectRatio(): number {
        return 1.0;
    }

    set aspectRatio(value: number) {
    }

    get magnification(): any {
        return null;
    }

    set magnification(value: any) {
    }

    get projectionType(): string {
        return this._projectionType;
    }

    set projectionType(value: string) {
        this._projectionType = value;
    }

    moveForward(distance: number): void {
    }

    getBoundingBox(): any {
        return null;
    }

    getEntityRendererKey(): any {
        throw new Error('get_entity_renderer_key is not implemented for Camera');
    }

    removeProperty(prop: Property | string): boolean {
        return false;
    }

    getProperty(property: string): any {
        return null;
    }

    setProperty(property: string, value: any): void {
    }

    findProperty(property: string): Property {
        return null;
    }
}
