import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../FileFormat';

export class ColladaFormatDetector extends FormatDetector {
    constructor() {
        super();
    }

    detect(stream: any, fileName: string): FileFormat | null {
        if (fileName && fileName.toLowerCase().endsWith('.dae')) {
            return ColladaFormat.getInstance();
        }

        if (stream) {
            try {
                if (stream.read) {
                    if (stream.seek) {
                        stream.seek(0);
                    }
                    const header = stream.read(500);
                    if (stream.seek) {
                        stream.seek(0);
                    }

                    let headerStr = '';
                    if (typeof header === 'string') {
                        headerStr = header.toLowerCase();
                    } else {
                        headerStr = header.toString().toLowerCase();
                    }

                    if (headerStr.includes('<collada') || headerStr.includes('collada.org')) {
                        return ColladaFormat.getInstance();
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        return null;
    }
}
