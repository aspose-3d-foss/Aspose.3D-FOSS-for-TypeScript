import { VertexElementFVector } from './VertexElementFVector';
import { VertexElementType } from './VertexElementType';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';

export class VertexElementTangent extends VertexElementFVector {
    constructor(name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        super(VertexElementType.TANGENT, name, mappingMode, referenceMode);
    }
}
