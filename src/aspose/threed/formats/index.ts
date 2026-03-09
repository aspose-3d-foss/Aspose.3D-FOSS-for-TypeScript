export { Exporter } from './Exporter';
export { FormatDetector } from './FormatDetector';
export { Importer } from './Importer';
export { LoadOptions } from './LoadOptions';
export { SaveOptions } from './SaveOptions';
export { IOConfig } from './IOConfig';
export { IOService } from './IOService';
export { Plugin } from './Plugin';

export { ColladaFormat, ColladaImporter, ColladaExporter, ColladaLoadOptions, ColladaSaveOptions, ColladaFormatDetector, ColladaPlugin, ColladaTransformStyle } from './collada';
export { FbxFormat, FbxImporter, FbxExporter, FbxLoadOptions, FbxSaveOptions, FbxFormatDetector, FbxPlugin } from './fbx';
export { GltfFormat, GltfImporter, GltfExporter, GltfLoadOptions, GltfSaveOptions, GltfFormatDetector, GltfPlugin } from './gltf';
export { StlFormat, StlImporter, StlExporter, StlLoadOptions, StlSaveOptions, StlFormatDetector, StlPlugin } from './stl';
export { ObjFormat, ObjImporter, ObjExporter, ObjLoadOptions, ObjSaveOptions, ObjFormatDetector, ObjPlugin } from './obj';
export { ThreeMfFormat, ThreeMfImporter, ThreeMfExporter, ThreeMfLoadOptions, ThreeMfSaveOptions, ThreeMfFormatDetector, ThreeMfPlugin } from './threemf';

import { ObjPlugin } from './obj';
import { StlPlugin } from './stl';
import { GltfPlugin } from './gltf';
import { ColladaPlugin } from './collada';
import { ThreeMfPlugin } from './threemf';
import { FbxPlugin } from './fbx';

export function initializePlugins(): void {
    ObjPlugin.getInstance();
    StlPlugin.getInstance();
    GltfPlugin.getInstance();
    ColladaPlugin.getInstance();
    ThreeMfPlugin.getInstance();
    FbxPlugin.getInstance();
}

initializePlugins();
