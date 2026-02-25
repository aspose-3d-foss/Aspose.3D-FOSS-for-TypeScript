import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../FileFormat';

export class GltfFormatDetector extends FormatDetector {
    constructor() {
        super();
    }

    detect(stream: any, fileName: string): FileFormat | null {
        if (fileName) {
            const fileNameLower = fileName.toLowerCase();
            if (fileNameLower.endsWith('.gltf') || fileNameLower.endsWith('.glb')) {
                return GltfFormat.getInstance();
            }
        }

        if (stream && stream.read && stream.seek) {
            const pos = stream.tell();
            stream.seek(0);
            const header = stream.read(4);
            stream.seek(pos);

            if (header.length >= 4) {
                const headerStr = header.toString('ascii', 0, 4);
                if (headerStr === 'glTF') {
                    return GltfFormat.getInstance();
                }
            }
        }

        return null;
    }
}
