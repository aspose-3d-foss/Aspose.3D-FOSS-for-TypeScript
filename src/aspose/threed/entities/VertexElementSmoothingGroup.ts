import { VertexElementIntsTemplate } from './VertexElementIntsTemplate';
import { VertexElementType } from './VertexElementType';
import { MappingMode } from './MappingMode';
import { ReferenceMode } from './ReferenceMode';

export class VertexElementSmoothingGroup extends VertexElementIntsTemplate {
    constructor(name: string = '', mappingMode: MappingMode | null = null, referenceMode: ReferenceMode | null = null) {
        super(VertexElementType.SMOOTHING_GROUP, name, mappingMode, referenceMode);
    }
}
