import { SceneObject } from './SceneObject';
import { Transform } from './Transform';
import { GlobalTransform } from './GlobalTransform';
import { BoundingBox } from '../utilities/BoundingBox';
import { Matrix4 } from '../utilities/Matrix4';
import { Entity } from './Entity';
import { Material } from '../shading/Material';

export class Node extends SceneObject {
    private _parentNode: Node | null = null;
    private _childNodes: Node[] = [];
    private _entities: Entity[] = [];
    private _materials: Material[] = [];
    private _transform: Transform = new Transform();
    private _visible: boolean = true;
    private _excluded: boolean = false;
    private _assetInfo: any = null;
    private _metaDatas: any[] = [];

    constructor(name?: string, entity?: Entity) {
        super(name);
        if (entity !== undefined) {
            this.addEntity(entity);
        }
    }

    get parentNode(): Node | null {
        return this._parentNode;
    }

    set parentNode(value: Node | null) {
        if (this._parentNode !== null) {
            const index = this._parentNode._childNodes.indexOf(this);
            if (index > -1) {
                this._parentNode._childNodes.splice(index, 1);
            }
            this._parentNode.scene = null;
        }

        this._parentNode = value;
        if (value !== null) {
            if (!this._parentNode._childNodes.includes(this)) {
                this._parentNode._childNodes.push(this);
            }
            if (this._parentNode.scene !== null) {
                this._propagateScene(this._parentNode.scene);
            }
        } else {
            this._propagateScene(null);
        }
    }

    get childNodes(): Node[] {
        return [...this._childNodes];
    }

    get entities(): Entity[] {
        return [...this._entities];
    }

    get entity(): Entity | undefined {
        return this._entities[0];
    }

    set entity(value: Entity | undefined) {
        this._entities = [];
        if (value !== undefined) {
            this._entities.push(value);
            if (!value._parentNodes.includes(this)) {
                value._parentNodes.push(this);
            }
        }
    }

    get materials(): Material[] {
        return [...this._materials];
    }

    get material(): Material | undefined {
        return this._materials[0];
    }

    set material(value: Material | undefined) {
        this._materials = [];
        if (value !== undefined) {
            this._materials.push(value);
        }
    }

    get transform(): Transform {
        return this._transform;
    }

    get globalTransform(): GlobalTransform {
        const matrix = this.evaluateGlobalTransform(true);
        return new GlobalTransform(matrix);
    }

    get visible(): boolean {
        return this._visible;
    }

    set visible(value: boolean) {
        this._visible = Boolean(value);
    }

    get excluded(): boolean {
        return this._excluded;
    }

    set excluded(value: boolean) {
        this._excluded = Boolean(value);
    }

    get assetInfo(): any {
        return this._assetInfo;
    }

    set assetInfo(value: any) {
        this._assetInfo = value;
    }

    get metaDatas(): any[] {
        return [...this._metaDatas];
    }

    addEntity(entity: Entity): void {
        if (!this._entities.includes(entity)) {
            this._entities.push(entity);
            if (!entity._parentNodes.includes(this)) {
                entity._parentNodes.push(this);
            }
        }
    }

    addChildNode(node: Node): void {
        if (!this._childNodes.includes(node)) {
            this._childNodes.push(node);
            node.parentNode = this;
        }
    }

    createChildNode(nodeName?: string, entity?: Entity, material?: Material): Node {
        const child = new Node(nodeName, entity);
        this.addChildNode(child);
        if (material !== undefined) {
            child.material = material;
        }
        return child;
    }

    getChild(indexOrName: number | string): Node | null {
        if (typeof indexOrName === 'number') {
            if (indexOrName >= 0 && indexOrName < this._childNodes.length) {
                return this._childNodes[indexOrName];
            }
            return null;
        } else {
            const nameStr = String(indexOrName);
            for (const child of this._childNodes) {
                if (child.name === nameStr) {
                    return child;
                }
            }
            return null;
        }
    }

    merge(node: Node): void {
        if (node === null || node === this) {
            return;
        }

        const childrenToMove = [...node._childNodes];
        for (const child of childrenToMove) {
            child.parentNode = this;
        }
    }

    evaluateGlobalTransform(withGeometricTransform: boolean): Matrix4 {
        let localMat = this._transform.transformMatrix;

        if (this._parentNode !== null) {
            const parentMat = this._parentNode.evaluateGlobalTransform(withGeometricTransform);
            localMat = parentMat.concatenate(localMat);
        }

        return localMat;
    }

    getBoundingBox(): BoundingBox {
        const bbox = BoundingBox.null;

        for (const entity of this._entities) {
            try {
                const entityBbox = entity.getBoundingBox();
                bbox.merge(entityBbox);
            } catch (e) {
                // Ignore NotImplementedError
            }
        }

        for (const child of this._childNodes) {
            const childBbox = child.getBoundingBox();
            bbox.merge(childBbox);
        }

        return bbox;
    }

    selectSingleObject(path: string): any {
        throw new Error('selectSingleObject is not implemented');
    }

    selectObjects(path: string): any[] {
        throw new Error('selectObjects is not implemented');
    }

    _propagateScene(scene: Scene | null): void {
        this.scene = scene;
        for (const child of this._childNodes) {
            child._propagateScene(scene);
        }
        for (const entity of this._entities) {
            entity.scene = scene;
        }
    }

    __repr__(): string {
        return `Node(${this.name}, children=${this._childNodes.length}, entities=${this._entities.length})`;
    }
}
