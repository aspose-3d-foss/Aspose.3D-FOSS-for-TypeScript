import { SceneObject } from './SceneObject';
import { Node } from './Node';
import { Entity } from './Entity';
import { AssetInfo } from './AssetInfo';
import { CustomObject } from './CustomObject';
import { AnimationClip } from '../animation/AnimationClip';

export class Scene extends SceneObject {
    static readonly VERSION = '24.12.0';

    private _subScenes: Scene[] = [];
    private _library: CustomObject[] = [];
    private _assetInfo: AssetInfo = new AssetInfo();
    private _animationClips: AnimationClip[] = [];
    private _currentAnimationClip: AnimationClip | null = null;
    private _poses: any[] = [];
    private _rootNode: Node = new Node();

    constructor();
    constructor(entity: Entity);
    constructor(parentScene: Scene, name: string);
    constructor(...args: any[]) {
        let name: string | undefined;
        let entity: Entity | undefined;

        if (args.length === 0) {
            name = '';
        } else if (args.length === 1) {
            if (args[0] instanceof Entity) {
                entity = args[0];
                name = '';
            } else if (typeof args[0] === 'string') {
                name = args[0];
            }
        } else if (args.length === 2) {
            if (args[0] instanceof Scene && typeof args[1] === 'string') {
                const [parentScene, sceneName] = args as [Scene, string];
                parentScene._subScenes.push(this);
                name = sceneName;
            }
        }

        super(name);
        this._rootNode = new Node();

        if (entity !== undefined) {
            this._rootNode.entity = entity;
        }

        this._propagateScene();
    }

    get rootNode(): Node {
        return this._rootNode;
    }

    get subScenes(): Scene[] {
        return [...this._subScenes];
    }

    get library(): CustomObject[] {
        return [...this._library];
    }

    get assetInfo(): AssetInfo {
        return this._assetInfo;
    }

    set assetInfo(value: AssetInfo) {
        this._assetInfo = value;
    }

    get animationClips(): AnimationClip[] {
        return [...this._animationClips];
    }

    get currentAnimationClip(): AnimationClip | null {
        return this._currentAnimationClip;
    }

    set currentAnimationClip(value: AnimationClip | null) {
        this._currentAnimationClip = value;
    }

    get poses(): any[] {
        return [...this._poses];
    }

    clear(): void {
        this._rootNode = new Node();
        this._subScenes = [];
        this._library = [];
        this._animationClips = [];
        this._currentAnimationClip = null;
        this._poses = [];
        this._propagateScene();
    }

    createAnimationClip(name: string): AnimationClip {
        const clip = new AnimationClip(name);
        clip.scene = this;
        this._animationClips.push(clip);
        if (this._currentAnimationClip === null) {
            this._currentAnimationClip = clip;
        }
        return clip;
    }

    getAnimationClip(name: string): AnimationClip | null {
        for (const clip of this._animationClips) {
            if (clip.name === name) {
                return clip;
            }
        }
        return null;
    }

    open(fileOrStream: any, options?: any): void {
        this.clear();
        throw new Error('open is not implemented');
    }

    save(fileOrStream: any, formatOrOptions?: any): void {
        throw new Error('save is not implemented');
    }

    render(camera: any, file_name_or_bitmap: any, size?: any, format?: any, options?: any): void {
        throw new Error('render is not implemented');
    }

    static fromFile(fileName: string): Scene {
        const scene = new Scene();
        scene.open(fileName);
        return scene;
    }

    _propagateScene(): void {
        this.scene = this;
        if (this._rootNode !== null) {
            this._rootNode.scene = this;
            this._rootNode._propagateScene(this);
        }
        for (const subScene of this._subScenes) {
            subScene.scene = this;
        }
    }

    toString(): string {
        const rootName = this._rootNode.name !== '' ? this._rootNode.name : 'None';
        return `Scene(${this.name}, root=${rootName})`;
    }
}
