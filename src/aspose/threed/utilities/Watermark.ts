import { Mesh } from '../entities/Mesh';

export class Watermark {
    static encodeWatermark(input: Mesh, text: string): Mesh;
    static encodeWatermark(input: Mesh, text: string, password: string): Mesh;
    static encodeWatermark(input: Mesh, text: string, password: string, permanent: boolean): Mesh;
    static encodeWatermark(input: Mesh, text: string, password?: string, permanent: boolean = false): Mesh {
        throw new Error('encodeWatermark is not implemented');
    }

    static decodeWatermark(input: Mesh): string;
    static decodeWatermark(input: Mesh, password: string): string;
    static decodeWatermark(input: Mesh, password?: string): string {
        throw new Error('decodeWatermark is not implemented');
    }
}
