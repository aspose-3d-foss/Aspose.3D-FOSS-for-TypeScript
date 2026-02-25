import { A3DObject } from '../A3DObject';
import { PropertyCollection } from '../PropertyCollection';
import { TextureBase } from './TextureBase';

export class Material extends A3DObject {
    static MAP_SPECULAR = 'Specular';
    static MAP_DIFFUSE = 'Diffuse';
    static MAP_EMISSIVE = 'Emissive';
    static MAP_AMBIENT = 'Ambient';
    static MAP_NORMAL = 'Normal';

    constructor(name: string = null) {
        super(name);
    }

    getTexture(slotName: string): TextureBase {
        throw new Error('getTexture is not implemented');
    }

    setTexture(slotName: string, texture: TextureBase): void {
        throw new Error('setTexture is not implemented');
    }
}
