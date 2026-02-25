import { LoadOptions } from '../LoadOptions';

export class GltfLoadOptions extends LoadOptions {
    private _flipTexCoordV: boolean = true;

    constructor() {
        super();
    }

    get flipTexCoordV(): boolean {
        return this._flipTexCoordV;
    }

    set flipTexCoordV(value: boolean) {
        this._flipTexCoordV = Boolean(value);
    }
}
