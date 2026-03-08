import { Camera } from './Camera';

export class Light extends Camera {
    private _lightType: string = 'POINT';

    constructor(name: string | null = null, lightType: any = null) {
        super(name, null);
        this._lightType = lightType !== null ? lightType : 'POINT';
    }

    get lightType(): string {
        return this._lightType;
    }

    set lightType(value: string) {
        this._lightType = value;
    }
}
