import { VertexElementFVector } from './VertexElementFVector';
import { VertexElementType } from './VertexElementType';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';

export class VertexElementVertexColor extends VertexElementFVector {
    constructor(name: string = '', mappingMode: MappingMode = null, referenceMode: ReferenceMode = null) {
        super(VertexElementType.VERTEX_COLOR, name, mappingMode, referenceMode);
    }
}
