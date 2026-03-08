import { Mesh } from '../entities/Mesh';

export class Watermark {
    static encodeWatermark(_input: Mesh, _text: string, _password?: string, _permanent: boolean = false): Mesh {
        throw new Error('encodeWatermark is not implemented');
    }

    static decodeWatermark(_input: Mesh, _password?: string): string {
        throw new Error('decodeWatermark is not implemented');
    }
}
