import { Camera } from './Camera';
import { LightType } from './LightType';

export class Light extends Camera {
    private _lightType: string = 'POINT';

    constructor(name: string = null, lightType: any = null) {
        super(name, null);
        this._lightType = lightType !== null ? lightType : 'POINT';
    }
}
