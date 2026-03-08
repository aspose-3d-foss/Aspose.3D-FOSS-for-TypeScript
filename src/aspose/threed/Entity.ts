import { SceneObject } from './SceneObject';
import { BoundingBox } from './utilities/BoundingBox';
import { Node } from './Node';

export class Entity extends SceneObject {
    protected _parentNodes: Node[] = [];
    private _excluded: boolean = false;

    constructor(name?: string) {
        super(name);
    }

    get parentNodes(): Node[] {
        return [...this._parentNodes];
    }

    get parentNode(): Node | undefined {
        return this._parentNodes[0];
    }

    set parentNode(value: Node | undefined) {
        if (value !== undefined) {
            if (!this._parentNodes.includes(value)) {
                this._parentNodes = [value];
            }
        } else {
            this._parentNodes = [];
        }
    }

    get excluded(): boolean {
        return this._excluded;
    }

    set excluded(value: boolean) {
        this._excluded = Boolean(value);
    }

    getBoundingBox(): BoundingBox {
        throw new Error('getBoundingBox is not implemented for base Entity class');
    }

    getEntityRendererKey(): any {
        throw new Error('getEntityRendererKey is not implemented for base Entity class');
    }

    
    _addParentNode(node: Node): void {
        if (!this._parentNodes.includes(node)) {
            this._parentNodes.push(node);
        }
    }

    _removeParentNode(node: Node): void {
        const index = this._parentNodes.indexOf(node);
        if (index > -1) {
            this._parentNodes.splice(index, 1);
        }
    }

    _hasParentNode(node: Node): boolean {
        return this._parentNodes.includes(node);
    }
}
