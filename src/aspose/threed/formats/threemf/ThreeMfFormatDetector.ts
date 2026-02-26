import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../../FileFormat';
import { ThreeMfFormat } from './ThreeMfFormat';

export class ThreeMfFormatDetector extends FormatDetector {
    constructor() {
        super();
    }

    detect(stream: any, fileName: string): FileFormat | null {
        if (fileName && fileName.toLowerCase().endsWith('.3mf')) {
            return ThreeMfFormat.getInstance();
        }

        if (stream) {
            try {
                if (stream.read) {
                    if (stream.seek) {
                        stream.seek(0);
                    }
                    const header = stream.read(4);
                    if (stream.seek) {
                        stream.seek(0);
                    }

                    if (header.length >= 2) {
                        const headerBytes = Buffer.from(header);
                        if (headerBytes[0] === 0x50 && headerBytes[1] === 0x4B) {
                            return ThreeMfFormat.getInstance();
                        }
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        return null;
    }
}
