import { IOConfig } from '../formats/IOConfig';

export class FileSystem {
    static createZipFileSystem(_stream: any, _baseDir?: string): FileSystem {
        throw new Error('createZipFileSystem is not implemented');
    }

    readFile(_fileName: string, _options?: IOConfig): any {
        throw new Error('readFile is not implemented');
    }

    writeFile(_fileName: string, _options?: IOConfig): any {
        throw new Error('writeFile is not implemented');
    }

    static createLocalFileSystem(_directory: string): FileSystem {
        throw new Error('createLocalFileSystem is not implemented');
    }

    static createDummyFileSystem(): FileSystem {
        throw new Error('createDummyFileSystem is not implemented');
    }
}
