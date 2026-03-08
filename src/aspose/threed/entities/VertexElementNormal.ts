import { VertexElementFVector } from './VertexElementFVector';
import { VertexElementType } from './VertexElementType';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';

export class VertexElementNormal extends VertexElementFVector {
    constructor(name: string = '', mappingMode: MappingMode | null = null, referenceMode: ReferenceMode | null = null) {
        super(VertexElementType.NORMAL, name, mappingMode, referenceMode);
    }
}
