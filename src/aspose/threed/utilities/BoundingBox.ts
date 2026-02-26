export class BoundingBox {
    private _minimum: { x: number; y: number; z: number } | null = null;
    private _maximum: { x: number; y: number; z: number } | null = null;
    private _isNull: boolean = true;

    constructor();
    constructor(minimum: { x: number; y: number; z: number }, maximum: { x: number; y: number; z: number });
    constructor(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._isNull = true;
            this._minimum = null;
            this._maximum = null;
        } else if (args.length === 2) {
            this._minimum = { x: args[0].x, y: args[0].y, z: args[0].z };
            this._maximum = { x: args[1].x, y: args[1].y, z: args[1].z };
            this._isNull = false;
        } else if (args.length === 6) {
            this._minimum = { x: Number(args[0]), y: Number(args[1]), z: Number(args[2]) };
            this._maximum = { x: Number(args[3]), y: Number(args[4]), z: Number(args[5]) };
            this._isNull = false;
        } else {
            throw new TypeError(`Invalid arguments for BoundingBox: ${args.length}`);
        }
    }

    get minimum(): { x: number; y: number; z: number } {
        if (this._isNull) {
            return { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: Number.POSITIVE_INFINITY };
        }
        return this._minimum!;
    }

    get maximum(): { x: number; y: number; z: number } {
        if (this._isNull) {
            return { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: Number.NEGATIVE_INFINITY };
        }
        return this._maximum!;
    }

    get center(): { x: number; y: number; z: number } {
        if (this._isNull) {
            return { x: 0, y: 0, z: 0 };
        }
        return {
            x: (this._minimum!.x + this._maximum!.x) * 0.5,
            y: (this._minimum!.y + this._maximum!.y) * 0.5,
            z: (this._minimum!.z + this._maximum!.z) * 0.5
        };
    }

    get size(): { x: number; y: number; z: number } {
        if (this._isNull) {
            return { x: 0, y: 0, z: 0 };
        }
        return {
            x: this._maximum!.x - this._minimum!.x,
            y: this._maximum!.y - this._minimum!.y,
            z: this._maximum!.z - this._minimum!.z
        };
    }

    static get null(): BoundingBox {
        const bb = new BoundingBox();
        bb._isNull = true;
        bb._minimum = null;
        bb._maximum = null;
        return bb;
    }

    static get infinite(): BoundingBox {
        return new BoundingBox(
            { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: Number.NEGATIVE_INFINITY },
            { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, z: Number.POSITIVE_INFINITY }
        );
    }

    merge(...args: any[]): void {
        if (this._isNull) {
            if (args.length === 1) {
                const arg = args[0];
                if (typeof arg === 'object' && arg !== null && 'x' in arg && 'y' in arg && 'z' in arg) {
                    this._minimum = { x: arg.x, y: arg.y, z: arg.z };
                    this._maximum = { x: arg.x, y: arg.y, z: arg.z };
                } else if (Array.isArray(arg) && arg.length >= 3) {
                    this._minimum = { x: Number(arg[0]), y: Number(arg[1]), z: Number(arg[2]) };
                    this._maximum = { x: Number(arg[0]), y: Number(arg[1]), z: Number(arg[2]) };
                }
            } else if (args.length === 3) {
                this._minimum = { x: Number(args[0]), y: Number(args[1]), z: Number(args[2]) };
                this._maximum = { x: Number(args[0]), y: Number(args[1]), z: Number(args[2]) };
            }
            this._isNull = false;
            return;
        }

        if (args.length === 1) {
            const arg = args[0];
            if (typeof arg === 'object' && arg !== null && 'x' in arg && 'y' in arg && 'z' in arg) {
                this._minimum!.x = Math.min(this._minimum!.x, arg.x);
                this._minimum!.y = Math.min(this._minimum!.y, arg.y);
                this._minimum!.z = Math.min(this._minimum!.z, arg.z);
                this._maximum!.x = Math.max(this._maximum!.x, arg.x);
                this._maximum!.y = Math.max(this._maximum!.y, arg.y);
                this._maximum!.z = Math.max(this._maximum!.z, arg.z);
            } else if (Array.isArray(arg) && arg.length >= 3) {
                const x = Number(arg[0]);
                const y = Number(arg[1]);
                const z = Number(arg[2]);
                this._minimum!.x = Math.min(this._minimum!.x, x);
                this._minimum!.y = Math.min(this._minimum!.y, y);
                this._minimum!.z = Math.min(this._minimum!.z, z);
                this._maximum!.x = Math.max(this._maximum!.x, x);
                this._maximum!.y = Math.max(this._maximum!.y, y);
                this._maximum!.z = Math.max(this._maximum!.z, z);
            }
        } else if (args.length === 3) {
            const x = Number(args[0]);
            const y = Number(args[1]);
            const z = Number(args[2]);
            this._minimum!.x = Math.min(this._minimum!.x, x);
            this._minimum!.y = Math.min(this._minimum!.y, y);
            this._minimum!.z = Math.min(this._minimum!.z, z);
            this._maximum!.x = Math.max(this._maximum!.x, x);
            this._maximum!.y = Math.max(this._maximum!.y, y);
            this._maximum!.z = Math.max(this._maximum!.z, z);
        }
    }

    contains(arg: any): boolean {
        if (typeof arg === 'object' && arg !== null) {
            if ('x' in arg && 'y' in arg && 'z' in arg) {
                return (this._minimum!.x <= arg.x && arg.x <= this._maximum!.x &&
                    this._minimum!.y <= arg.y && arg.y <= this._maximum!.y &&
                    this._minimum!.z <= arg.z && arg.z <= this._maximum!.z);
            }
            if ('_minimum' in arg && '_maximum' in arg) {
                return (this._minimum!.x <= arg._minimum.x &&
                    this._minimum!.y <= arg._minimum.y &&
                    this._minimum!.z <= arg._minimum.z &&
                    this._maximum!.x >= arg._maximum.x &&
                    this._maximum!.y >= arg._maximum.y &&
                    this._maximum!.z >= arg._maximum.z);
            }
        }
        return false;
    }

    overlapsWith(box: BoundingBox): boolean {
        return !(this._maximum!.x < box._minimum!.x ||
            box._maximum!.x < this._minimum!.x ||
            this._maximum!.y < box._minimum!.y ||
            box._maximum!.y < this._minimum!.y ||
            this._maximum!.z < box._minimum!.z ||
            box._maximum!.z < this._minimum!.z);
    }

    scale(): number {
        if (this._isNull) {
            return 0.0;
        }
        const maxX = Math.max(Math.abs(this._minimum!.x), Math.abs(this._maximum!.x));
        const maxY = Math.max(Math.abs(this._minimum!.y), Math.abs(this._maximum!.y));
        const maxZ = Math.max(Math.abs(this._minimum!.z), Math.abs(this._maximum!.z));
        return Math.max(maxX, maxY, maxZ);
    }

    get extent(): BoundingBoxExtent {
        if (this._isNull) {
            return new BoundingBoxExtent(0, 0, 0);
        }
        const center = this.center;
        const size = this.size;
        return new BoundingBoxExtent(
            Math.abs(size.x * 0.5),
            Math.abs(size.y * 0.5),
            Math.abs(size.z * 0.5)
        );
    }

    toString(): string {
        if (this._isNull) {
            return `BoundingBox(null)`;
        }
        return `BoundingBox(min=${JSON.stringify(this._minimum)}, max=${JSON.stringify(this._maximum)})`;
    }
}

export class BoundingBoxExtent {
    private _extentX: number;
    private _extentY: number;
    private _extentZ: number;

    constructor(extentX: number = 0.0, extentY: number = 0.0, extentZ: number = 0.0) {
        this._extentX = Number(extentX);
        this._extentY = Number(extentY);
        this._extentZ = Number(extentZ);
    }

    get extentX(): number {
        return this._extentX;
    }

    get extentY(): number {
        return this._extentY;
    }

    get extentZ(): number {
        return this._extentZ;
    }

    toString(): string {
        return `BoundingBoxExtent(${this._extentX}, ${this._extentY}, ${this._extentZ})`;
    }
}
