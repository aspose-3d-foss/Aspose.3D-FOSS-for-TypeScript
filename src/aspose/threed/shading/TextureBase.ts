import { A3DObject } from '../A3DObject';

export class TextureBase extends A3DObject {
    constructor(name?: string) {
        super(name);
    }

    get content(): any {
        return null;
    }

    set content(_value: any) {
    }
}
