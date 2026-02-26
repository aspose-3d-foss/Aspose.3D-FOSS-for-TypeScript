import { VertexElementFVector } from './VertexElementFVector';
import { VertexElementType } from './VertexElementType';
import { TextureMapping } from './TextureMapping';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { FVector2, FVector3, FVector4 } from '../utilities';

export class VertexElementUV extends VertexElementFVector {
    private _textureMapping: TextureMapping;

    constructor(textureMapping: TextureMapping = null, name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        if (textureMapping === null) {
            textureMapping = TextureMapping.DIFFUSE;
        }
        super(VertexElementType.UV, name, mappingMode, referenceMode);
        this._textureMapping = textureMapping;
    }

    get textureMapping(): TextureMapping {
        return this._textureMapping;
    }

    addData(data: any[]): void {
        if (Array.isArray(data) && data.length > 0) {
            if (data[0] instanceof FVector2) {
                this._data.push(...data.map(v => new FVector4(v.x, v.y, 0.0, 0.0)));
            } else if (data[0] instanceof FVector3) {
                this._data.push(...data.map(v => new FVector4(v.x, v.y, v.z, 0.0)));
            } else if (data[0] instanceof FVector4) {
                this._data.push(...data);
            } else {
                throw new TypeError(`Unsupported data type for VertexElementUV: ${typeof data[0]}`);
            }
        }
    }
}
