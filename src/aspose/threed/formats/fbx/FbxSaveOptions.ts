import { SaveOptions } from '../SaveOptions';

export class FbxSaveOptions extends SaveOptions {
    private _embedTextures: boolean = false;

    constructor() {
        super();
    }

    get embedTextures(): boolean {
        return this._embedTextures;
    }

    set embedTextures(value: boolean) {
        this._embedTextures = Boolean(value);
    }
}
