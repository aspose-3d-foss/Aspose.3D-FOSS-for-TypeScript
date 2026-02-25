import { Rect } from './Rect';

export class RelativeRectangle {
    private _scaleX: number;
    private _scaleY: number;
    private _scaleWidth: number;
    private _scaleHeight: number;
    private _offsetX: number;
    private _offsetY: number;
    private _offsetWidth: number;
    private _offsetHeight: number;

    constructor();
    constructor(left: number, top: number, width: number, height: number);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._scaleX = 0;
            this._scaleY = 0;
            this._scaleWidth = 0;
            this._scaleHeight = 0;
            this._offsetX = 0;
            this._offsetY = 0;
            this._offsetWidth = 0;
            this._offsetHeight = 0;
        } else if (args.length === 4) {
            this._scaleX = 0;
            this._scaleY = 0;
            this._scaleWidth = 0;
            this._scaleHeight = 0;
            this._offsetX = Number(args[0]);
            this._offsetY = Number(args[1]);
            this._offsetWidth = Number(args[2]);
            this._offsetHeight = Number(args[3]);
        } else {
            throw new TypeError(`Invalid arguments for RelativeRectangle: ${args.length}`);
        }
    }

    toAbsolute(left: number, top: number, width: number, height: number): Rect {
        const x = Math.round(left * this._scaleX + this._offsetX);
        const y = Math.round(top * this._scaleY + this._offsetY);
        const w = Math.round(width * this._scaleWidth + this._offsetWidth);
        const h = Math.round(height * this._scaleHeight + this._offsetHeight);
        return new Rect(x, y, w, h);
    }

    static fromScale(scaleX: number, scaleY: number, scaleWidth: number, scaleHeight: number): RelativeRectangle {
        const rect = new RelativeRectangle();
        rect._scaleX = scaleX;
        rect._scaleY = scaleY;
        rect._scaleWidth = scaleWidth;
        rect._scaleHeight = scaleHeight;
        return rect;
    }

    get scaleX(): number {
        return this._scaleX;
    }

    set scaleX(value: number) {
        this._scaleX = value;
    }

    get scaleY(): number {
        return this._scaleY;
    }

    set scaleY(value: number) {
        this._scaleY = value;
    }

    get scaleWidth(): number {
        return this._scaleWidth;
    }

    set scaleWidth(value: number) {
        this._scaleWidth = value;
    }

    get scaleHeight(): number {
        return this._scaleHeight;
    }

    set scaleHeight(value: number) {
        this._scaleHeight = value;
    }

    get offsetX(): number {
        return this._offsetX;
    }

    set offsetX(value: number) {
        this._offsetX = value;
    }

    get offsetY(): number {
        return this._offsetY;
    }

    set offsetY(value: number) {
        this._offsetY = value;
    }

    get offsetWidth(): number {
        return this._offsetWidth;
    }

    set offsetWidth(value: number) {
        this._offsetWidth = value;
    }

    get offsetHeight(): number {
        return this._offsetHeight;
    }

    set offsetHeight(value: number) {
        this._offsetHeight = value;
    }
}
