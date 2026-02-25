import { Vector2 } from './Vector2';

export class BoundingBox2D {
    private _minimum: Vector2;
    private _maximum: Vector2;
    private _isNull: boolean = true;

    constructor();
    constructor(minimum: Vector2, maximum: Vector2);
    constructor(minX: number, minY: number, maxX: number, maxY: number);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._isNull = true;
            this._minimum = new Vector2(0, 0);
            this._maximum = new Vector2(0, 0);
        } else if (args.length === 2 && args[0] instanceof Vector2 && args[1] instanceof Vector2) {
            this._minimum = new Vector2(args[0].x, args[0].y);
            this._maximum = new Vector2(args[1].x, args[1].y);
            this._isNull = false;
        } else if (args.length === 4) {
            this._minimum = new Vector2(Number(args[0]), Number(args[1]));
            this._maximum = new Vector2(Number(args[2]), Number(args[3]));
            this._isNull = false;
        } else {
            throw new TypeError(`Invalid arguments for BoundingBox2D: ${args.length}`);
        }
    }

    merge(pt: Vector2): void;
    merge(bb: BoundingBox2D): void;
    merge(...args: any[]): void {
        if (this._isNull) {
            if (args.length === 1) {
                const arg = args[0];
                if (arg instanceof Vector2) {
                    this._minimum = new Vector2(arg.x, arg.y);
                    this._maximum = new Vector2(arg.x, arg.y);
                } else if (arg instanceof BoundingBox2D) {
                    this._minimum = new Vector2(arg.minimum.x, arg.minimum.y);
                    this._maximum = new Vector2(arg.maximum.x, arg.maximum.y);
                }
            }
            this._isNull = false;
            return;
        }

        if (args.length === 1) {
            const arg = args[0];
            if (arg instanceof Vector2) {
                this._minimum.x = Math.min(this._minimum.x, arg.x);
                this._minimum.y = Math.min(this._minimum.y, arg.y);
                this._maximum.x = Math.max(this._maximum.x, arg.x);
                this._maximum.y = Math.max(this._maximum.y, arg.y);
            } else if (arg instanceof BoundingBox2D) {
                this._minimum.x = Math.min(this._minimum.x, arg.minimum.x);
                this._minimum.y = Math.min(this._minimum.y, arg.minimum.y);
                this._maximum.x = Math.max(this._maximum.x, arg.maximum.x);
                this._maximum.y = Math.max(this._maximum.y, arg.maximum.y);
            }
        }
    }

    get extent(): BoundingBoxExtent {
        if (this._isNull) {
            return BoundingBoxExtent.null;
        }
        const center = this.getCenter();
        const size = this.getSize();
        return new BoundingBoxExtent(Math.abs(size.x * 0.5), Math.abs(size.y * 0.5), 0);
    }

    get minimum(): Vector2 {
        if (this._isNull) {
            return new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        }
        return new Vector2(this._minimum.x, this._minimum.y);
    }

    get maximum(): Vector2 {
        if (this._isNull) {
            return new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        }
        return new Vector2(this._maximum.x, this._maximum.y);
    }

    getCenter(): Vector2 {
        if (this._isNull) {
            return new Vector2(0, 0);
        }
        return new Vector2(
            (this._minimum.x + this._maximum.x) * 0.5,
            (this._minimum.y + this._maximum.y) * 0.5
        );
    }

    getSize(): Vector2 {
        if (this._isNull) {
            return new Vector2(0, 0);
        }
        return new Vector2(
            this._maximum.x - this._minimum.x,
            this._maximum.y - this._minimum.y
        );
    }

    overlapsWith(box: BoundingBox2D): boolean {
        return !(this._maximum.x < box.minimum.x ||
            box.maximum.x < this._minimum.x ||
            this._maximum.y < box.minimum.y ||
            box.maximum.y < this._minimum.y);
    }

    static get null(): BoundingBox2D {
        const bb = new BoundingBox2D();
        bb._isNull = true;
        return bb;
    }

    static get infinite(): BoundingBox2D {
        return new BoundingBox2D(
            new Vector2(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
            new Vector2(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)
        );
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

    static get null(): BoundingBoxExtent {
        return new BoundingBoxExtent(0, 0, 0);
    }

    static get finite(): BoundingBoxExtent {
        return new BoundingBoxExtent(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE);
    }

    static get infinite(): BoundingBoxExtent {
        return new BoundingBoxExtent(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    }
}
