import { FormatDetector } from '../FormatDetector';
import { FileFormat } from '../../FileFormat';
import { FbxFormat } from './FbxFormat';

export class FbxFormatDetector extends FormatDetector {
    detect(stream: any, fileName: string): FileFormat | null {
        if (fileName && fileName.toLowerCase().endsWith('.fbx')) {
            return FbxFormat.getInstance();
        }

        if (stream && stream.read) {
            try {
                if (stream.seek) {
                    stream.seek(0);
                }
                const header = stream.read(20);
                if (stream.seek) {
                    stream.seek(0);
                }

                if (header) {
                    const headerStr = typeof header === 'string' ? header : header.toString('ascii');
                    if (headerStr.startsWith('Kaydara FBX Binary') || headerStr.includes('FBX')) {
                        return FbxFormat.getInstance();
                    }
                }
            } catch (e) {
                // ignore
            }
        }

        return null;
    }
}
