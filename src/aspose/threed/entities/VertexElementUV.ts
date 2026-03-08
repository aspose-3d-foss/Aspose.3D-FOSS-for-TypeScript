import { VertexElementFVector } from './VertexElementFVector';
import { VertexElementType } from './VertexElementType';
import { TextureMapping } from './TextureMapping';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';
import { FVector2, FVector3, FVector4 } from '../utilities';

export class VertexElementUV extends VertexElementFVector {
    private _textureMapping: TextureMapping;
    private _uvData: FVector2[] = [];

    constructor(textureMapping: TextureMapping | null = null, name: string = '', mappingMode: MappingMode | null = null, referenceMode: ReferenceMode | null = null) {
        if (textureMapping === null) {
            textureMapping = TextureMapping.DIFFUSE;
        }
        super(VertexElementType.UV, name, mappingMode, referenceMode);
        this._textureMapping = textureMapping;
    }

    get textureMapping(): TextureMapping {
        return this._textureMapping;
    }

    addData(data: FVector2[] | FVector3[] | FVector4[]): void {
        if (Array.isArray(data) && data.length > 0) {
            if (data[0] instanceof FVector2) {
                this._uvData = [...data] as FVector2[];
            } else if (data[0] instanceof FVector3) {
                this._uvData = (data as FVector3[]).map((v: FVector3) => new FVector2(v.x, v.y));
            } else if (data[0] instanceof FVector4) {
                this._uvData = (data as FVector4[]).map((v: FVector4) => new FVector2(v.x, v.y));
            } else {
                throw new TypeError(`Unsupported data type for VertexElementUV: ${typeof data[0]}`);
            }
        }
    }

    get data(): FVector4[] {
        return this._uvData.map((v: FVector2) => new FVector4(v.x, v.y, 0.0, 0.0));
    }

    get uvData(): FVector2[] {
        return [...this._uvData];
    }
}
