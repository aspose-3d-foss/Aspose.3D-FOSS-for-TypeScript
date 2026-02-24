import { A3DObject } from '../A3DObject';

export class SceneObject extends A3DObject {
    protected _scene: Scene | null = null;

    constructor(name?: string) {
        super(name);
    }

    get scene(): Scene | null {
        return this._scene;
    }

    set scene(value: Scene | null) {
        this._scene = value;
    }
}
