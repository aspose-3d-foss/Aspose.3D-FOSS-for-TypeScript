import { LoadOptions } from '../LoadOptions';

export class FbxLoadOptions extends LoadOptions {
    private _keepBuiltinGlobalSettings: boolean = true;

    constructor() {
        super();
    }

    get keepBuiltinGlobalSettings(): boolean {
        return this._keepBuiltinGlobalSettings;
    }

    set keepBuiltinGlobalSettings(value: boolean) {
        this._keepBuiltinGlobalSettings = Boolean(value);
    }
}
