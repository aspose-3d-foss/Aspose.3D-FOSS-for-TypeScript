export class Rect {
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;

    constructor();
    constructor(x: number, y: number, width: number, height: number);
    constructor(...args: any[]) {
        if (args.length === 0) {
            this._x = 0;
            this._y = 0;
            this._width = 0;
            this._height = 0;
        } else if (args.length === 4) {
            this._x = Number(args[0]);
            this._y = Number(args[1]);
            this._width = Number(args[2]);
            this._height = Number(args[3]);
        } else {
            throw new TypeError(`Invalid arguments for Rect: ${args.length}`);
        }
    }

    contains(x: number, y: number): boolean {
        return this._x <= x && x < this._x + this._width &&
               this._y <= y && y < this._y + this._height;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = Number(value);
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = Number(value);
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = Number(value);
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = Number(value);
    }

    get left(): number {
        return this._x;
    }

    get right(): number {
        return this._x + this._width;
    }

    get top(): number {
        return this._y;
    }

    get bottom(): number {
        return this._y + this._height;
    }
}
