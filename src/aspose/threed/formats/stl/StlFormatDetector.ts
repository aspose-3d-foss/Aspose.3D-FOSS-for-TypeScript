import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../FileFormat';

export class StlFormatDetector extends FormatDetector {
    constructor() {
        super();
    }

    detect(stream: any, fileName: string): FileFormat | null {
        if (!stream || !stream.read) {
            return null;
        }

        const hasStlExtension = fileName && fileName.toLowerCase().endsWith('.stl');

        try {
            if (stream.seek) {
                stream.seek(0);
            }
            const data = stream.read(5);
            if (stream.seek) {
                stream.seek(0);
            }

            if (!data) {
                return null;
            }

            const dataStr = data.toString().toLowerCase();

            if (dataStr.startsWith('solid')) {
                if (hasStlExtension) {
                    return StlFormat.getInstance();
                }
                return null;
            } else {
                try {
                    if (stream.seek) {
                        stream.seek(80);
                    }
                    const countData = stream.read(4);
                    if (stream.seek) {
                        stream.seek(0);
                    }

                    if (countData.length === 4) {
                        if (hasStlExtension) {
                            return StlFormat.getInstance();
                        }
                        return null;
                    }
                } catch (e) {
                    // ignore
                }
            }
        } catch (e) {
            // ignore
        }

        return null;
    }
}
