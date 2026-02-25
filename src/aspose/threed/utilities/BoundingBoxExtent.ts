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
