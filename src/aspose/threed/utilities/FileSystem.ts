import { IOConfig } from '../formats/IOConfig';

export class FileSystem {
    static createZipFileSystem(stream: any, baseDir: string): FileSystem;
    static createZipFileSystem(fileName: string): FileSystem;
    static createZipFileSystem(arg: any, baseDir?: string): FileSystem {
        throw new Error('createZipFileSystem is not implemented');
    }

    readFile(fileName: string, options: IOConfig): any {
        throw new Error('readFile is not implemented');
    }

    writeFile(fileName: string, options: IOConfig): any {
        throw new Error('writeFile is not implemented');
    }

    static createLocalFileSystem(directory: string): FileSystem {
        throw new Error('createLocalFileSystem is not implemented');
    }

    static createDummyFileSystem(): FileSystem {
        throw new Error('createDummyFileSystem is not implemented');
    }
}
