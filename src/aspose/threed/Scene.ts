import { SceneObject } from './SceneObject';
import { Node } from './Node';
import { Entity } from './Entity';
import { AssetInfo } from './AssetInfo';
import { CustomObject } from './CustomObject';
import { AnimationClip } from './animation/AnimationClip';

export class Scene extends SceneObject {
    static readonly VERSION = '24.12.0';

    private _subScenes: Scene[] = [];
    private _library: CustomObject[] = [];
    private _assetInfo: AssetInfo = new AssetInfo();
    private _animationClips: AnimationClip[] = [];
    private _currentAnimationClip: AnimationClip | null = null;
    private _poses: any[] = [];
    private _rootNode: Node = new Node();

    constructor();
    constructor(entity: Entity);
    constructor(parentScene: Scene, name: string);
    constructor(...args: any[]) {
        let name: string | undefined;
        let entity: Entity | undefined;
        let parentScene: Scene | undefined;

        if (args.length === 0) {
            name = '';
        } else if (args.length === 1) {
            if (args[0] instanceof Entity) {
                entity = args[0];
                name = '';
            } else if (typeof args[0] === 'string') {
                name = args[0];
            }
        } else if (args.length === 2) {
            if (args[0] instanceof Scene && typeof args[1] === 'string') {
                parentScene = args[0];
                name = args[1];
            }
        }

        super(name);

        if (parentScene !== undefined) {
            parentScene._subScenes.push(this);
        }

        if (entity !== undefined) {
            this._rootNode.entity = entity;
        }

        this._propagateScene();
    }

    get rootNode(): Node {
        return this._rootNode;
    }

    get subScenes(): Scene[] {
        return [...this._subScenes];
    }

    get library(): CustomObject[] {
        return [...this._library];
    }

    get assetInfo(): AssetInfo {
        return this._assetInfo;
    }

    set assetInfo(value: AssetInfo) {
        this._assetInfo = value;
    }

    get animationClips(): AnimationClip[] {
        return [...this._animationClips];
    }

    get currentAnimationClip(): AnimationClip | null {
        return this._currentAnimationClip;
    }

    set currentAnimationClip(value: AnimationClip | null) {
        this._currentAnimationClip = value;
    }

    get poses(): any[] {
        return [...this._poses];
    }

    clear(): void {
        this._rootNode = new Node();
        this._subScenes = [];
        this._library = [];
        this._animationClips = [];
        this._currentAnimationClip = null;
        this._poses = [];
        this._propagateScene();
    }

    createAnimationClip(name: string): AnimationClip {
        const clip = new AnimationClip(name);
        clip.scene = this;
        this._animationClips.push(clip);
        if (this._currentAnimationClip === null) {
            this._currentAnimationClip = clip;
        }
        return clip;
    }

    getAnimationClip(name: string): AnimationClip | null {
        for (const clip of this._animationClips) {
            if (clip.name === name) {
                return clip;
            }
        }
        return null;
    }

    open(fileOrStream: any, options?: any): void {
        this.clear();
        
        if (typeof fileOrStream === 'string') {
            const fs = require('fs');
            const buffer = fs.readFileSync(fileOrStream);
            this.openFromBuffer(buffer, options);
        } else if (fileOrStream && typeof fileOrStream.read === 'function') {
            const chunks: Buffer[] = [];
            let totalLength = 0;
            const stream = fileOrStream as NodeJS.ReadableStream;
            stream.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
                totalLength += chunk.length;
            });
            stream.on('end', () => {
                const buffer = Buffer.concat(chunks, totalLength);
                this.openFromBuffer(buffer, options);
            });
        } else {
            throw new TypeError('fileOrStream must be a file path or a readable stream');
        }
    }

    openFromBuffer(buffer: Buffer | Uint8Array, options?: any): void {
        this.clear();
        
        let detectedFormat: string | null = null;
        const buf = buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        
        if (buf.length >= 4) {
            const magic = buf.readUInt32LE(0);
            if (magic === 0x46546C67) {
                detectedFormat = 'glb';
            } else if (magic === 0x04034B50) {
                detectedFormat = '3mf';
            }
        }
        
        if (!detectedFormat) {
            const content = buf.toString('utf-8', 0, Math.min(100, buf.length)).trim();
            if (content.startsWith('{') || content.startsWith('"asset"')) {
                try {
                    const json = JSON.parse(buf.toString('utf-8'));
                    if (json.asset && json.asset.version) {
                        detectedFormat = 'gltf';
                    }
                } catch {
                }
            } else if (content.startsWith('<') || content.includes('<?xml') || content.includes('<COLLADA')) {
                detectedFormat = 'dae';
            } else if (content.includes('mtllib') || content.includes('usemtl') || content.match(/^v\s+-?\d/)) {
                detectedFormat = 'obj';
            }
        }
        
        if (!detectedFormat) {
            const header = buf.toString('ascii', 0, Math.min(80, buf.length)).toLowerCase();
            if (header.startsWith('solid') || !header.startsWith('solid')) {
                const numTriangles = buf.length >= 84 ? buf.readUInt32LE(80) : 0;
                const expectedSize = 84 + numTriangles * 50;
                if (buf.length === expectedSize || header.startsWith('solid')) {
                    detectedFormat = 'stl';
                }
            }
        }
        
        if (detectedFormat === 'gltf' || detectedFormat === 'glb') {
            const { GltfFormat } = require('./formats/gltf/GltfFormat');
            const { GltfImporter } = require('./formats/gltf/GltfImporter');
            const format = GltfFormat.getInstance();
            const loadOptions = options || format.createLoadOptions();
            const importer = new GltfImporter();
            importer.importScene(this, buffer, loadOptions);
        } else if (detectedFormat === '3mf') {
            const { ThreeMfFormat } = require('./formats/threemf/ThreeMfFormat');
            const { ThreeMfImporter } = require('./formats/threemf/ThreeMfImporter');
            const format = ThreeMfFormat.getInstance();
            const loadOptions = options || format.createLoadOptions();
            const importer = new ThreeMfImporter();
            importer.importScene(this, buffer, loadOptions);
        } else if (detectedFormat === 'dae') {
            const { ColladaFormat } = require('./formats/collada/ColladaFormat');
            const { ColladaImporter } = require('./formats/collada/ColladaImporter');
            const format = ColladaFormat.getInstance();
            const loadOptions = options || format.createLoadOptions();
            const importer = new ColladaImporter();
            importer.importScene(this, buffer, loadOptions);
        } else if (detectedFormat === 'obj') {
            const { ObjFormat } = require('./formats/obj/ObjFormat');
            const { ObjImporter } = require('./formats/obj/ObjImporter');
            const format = ObjFormat.getInstance();
            const loadOptions = options || format.createLoadOptions();
            const importer = new ObjImporter();
            importer.importScene(this, buffer, loadOptions);
        } else {
            const { StlFormat } = require('./formats/stl/StlFormat');
            const { StlImporter } = require('./formats/stl/StlImporter');
            const format = StlFormat.getInstance();
            const loadOptions = options || format.createLoadOptions();
            const importer = new StlImporter();
            importer.importScene(this, buffer, loadOptions);
        }
    }

    save(fileOrStream: any, formatOrOptions?: any, options?: any): void {
        let format: any = null;
        let saveOptions: any = null;
        
        if (formatOrOptions && typeof formatOrOptions === 'object' && formatOrOptions.constructor.name.endsWith('Format')) {
            format = formatOrOptions;
            saveOptions = options || format.createSaveOptions();
        } else if (formatOrOptions && formatOrOptions.constructor.name.endsWith('SaveOptions')) {
            saveOptions = formatOrOptions;
            if (typeof fileOrStream === 'string') {
                const ext = fileOrStream.split('.').pop()?.toLowerCase();
                if (ext === '3mf') {
                    const { ThreeMfFormat } = require('./formats/threemf/ThreeMfFormat');
                    format = ThreeMfFormat.getInstance();
                } else if (ext === 'stl') {
                    const { StlFormat } = require('./formats/stl/StlFormat');
                    format = StlFormat.getInstance();
                } else if (ext === 'gltf' || ext === 'glb') {
                    const { GltfFormat } = require('./formats/gltf/GltfFormat');
                    format = GltfFormat.getInstance();
                } else if (ext === 'dae') {
                    const { ColladaFormat } = require('./formats/collada/ColladaFormat');
                    format = ColladaFormat.getInstance();
                } else if (ext === 'obj') {
                    const { ObjFormat } = require('./formats/obj/ObjFormat');
                    format = ObjFormat.getInstance();
                }
            }
        } else if (formatOrOptions && typeof formatOrOptions === 'string') {
            const ext = formatOrOptions.toLowerCase();
            if (ext === 'obj') {
                const { ObjFormat } = require('./formats/obj/ObjFormat');
                format = ObjFormat.getInstance();
                saveOptions = format.createSaveOptions();
            } else if (ext === 'stl') {
                const { StlFormat } = require('./formats/stl/StlFormat');
                format = StlFormat.getInstance();
                saveOptions = format.createSaveOptions();
            } else if (ext === 'gltf') {
                const { GltfFormat } = require('./formats/gltf/GltfFormat');
                format = GltfFormat.getInstance();
                saveOptions = format.createSaveOptions();
            } else if (ext === 'glb') {
                const { GltfFormat } = require('./formats/gltf/GltfFormat');
                format = GltfFormat.getInstance();
                saveOptions = format.createSaveOptions();
                saveOptions.binaryMode = true;
            } else if (ext === 'dae') {
                const { ColladaFormat } = require('./formats/collada/ColladaFormat');
                format = ColladaFormat.getInstance();
                saveOptions = format.createSaveOptions();
            } else if (ext === '3mf') {
                const { ThreeMfFormat } = require('./formats/threemf/ThreeMfFormat');
                format = ThreeMfFormat.getInstance();
                saveOptions = format.createSaveOptions();
            }
        } else if (typeof fileOrStream === 'string') {
            const ext = fileOrStream.split('.').pop()?.toLowerCase();
            if (ext === 'obj') {
                const { ObjFormat } = require('./formats/obj/ObjFormat');
                format = ObjFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
            } else if (ext === 'stl') {
                const { StlFormat } = require('./formats/stl/StlFormat');
                format = StlFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
            } else if (ext === 'gltf') {
                const { GltfFormat } = require('./formats/gltf/GltfFormat');
                format = GltfFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
            } else if (ext === 'glb') {
                const { GltfFormat } = require('./formats/gltf/GltfFormat');
                format = GltfFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
                saveOptions.binaryMode = true;
            } else if (ext === 'dae') {
                const { ColladaFormat } = require('./formats/collada/ColladaFormat');
                format = ColladaFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
            } else if (ext === '3mf') {
                const { ThreeMfFormat } = require('./formats/threemf/ThreeMfFormat');
                format = ThreeMfFormat.getInstance();
                saveOptions = saveOptions || format.createSaveOptions();
            }
        }
        
        if (!format) {
            const { ObjFormat } = require('./formats/obj/ObjFormat');
            format = ObjFormat.getInstance();
            saveOptions = saveOptions || format.createSaveOptions();
        }
        
        let stream: any;
        if (typeof fileOrStream === 'string') {
            const fs = require('fs');
            stream = {
                content: '',
                write(data: string | Buffer) {
                    if (Buffer.isBuffer(data)) {
                        fs.writeFileSync(fileOrStream, data);
                    } else {
                        this.content += data;
                    }
                },
                close() {
                    if (this.content) {
                        fs.writeFileSync(fileOrStream, this.content, 'utf-8');
                    }
                }
            };
        } else if (fileOrStream && typeof fileOrStream.write === 'function') {
            stream = fileOrStream;
        } else {
            throw new TypeError('fileOrStream must be a file path or a stream with write() method');
        }
        
        const { ObjExporter } = require('./formats/obj/ObjExporter');
        const { StlExporter } = require('./formats/stl/StlExporter');
        const { GltfExporter } = require('./formats/gltf/GltfExporter');
        const { ColladaExporter } = require('./formats/collada/ColladaExporter');
        const { ThreeMfExporter } = require('./formats/threemf/ThreeMfExporter');
        
        let exporter: any;
        if (format.constructor.name === 'ObjFormat') {
            exporter = new ObjExporter();
        } else if (format.constructor.name === 'StlFormat') {
            exporter = new StlExporter();
        } else if (format.constructor.name === 'GltfFormat') {
            exporter = new GltfExporter();
        } else if (format.constructor.name === 'ColladaFormat') {
            exporter = new ColladaExporter();
        } else if (format.constructor.name === 'ThreeMfFormat') {
            exporter = new ThreeMfExporter();
        } else {
            throw new Error(`Unsupported format: ${format.constructor.name}`);
        }
        
        exporter.export(this, stream, saveOptions);
        
        if (stream.close) {
            stream.close();
        }
    }

    saveToBuffer(format: string = 'obj', _options?: any): Buffer {
        let content = '';
        const stream = {
            write(data: string) {
                content += data;
            }
        };
        
        this.save(stream, format);
        return Buffer.from(content, 'utf-8');
    }

    render(_camera: any, _file_name_or_bitmap: any, _size?: any, _format?: any, _options?: any): void {
        throw new Error('render is not implemented');
    }

    static fromFile(fileName: string): Scene {
        const scene = new Scene();
        scene.open(fileName);
        return scene;
    }

    _propagateScene(): void {
        this.scene = this;
        if (this._rootNode !== null) {
            this._rootNode.scene = this;
            this._rootNode._propagateScene(this);
        }
        for (const subScene of this._subScenes) {
            subScene.scene = this;
        }
    }

    toString(): string {
        const rootName = this._rootNode.name !== '' ? this._rootNode.name : 'None';
        return `Scene(${this.name}, root=${rootName})`;
    }
}
