import { A3DObject } from '../A3DObject';
import { TextureBase } from './TextureBase';

export class Material extends A3DObject {
    static MAP_SPECULAR = 'Specular';
    static MAP_DIFFUSE = 'Diffuse';
    static MAP_EMISSIVE = 'Emissive';
    static MAP_AMBIENT = 'Ambient';
    static MAP_NORMAL = 'Normal';

    constructor(name?: string | null) {
        super(name ?? undefined);
    }

    getTexture(_slotName: string): TextureBase | null {
        return null;
    }

    setTexture(_slotName: string, _texture: TextureBase): void {
    }
}
