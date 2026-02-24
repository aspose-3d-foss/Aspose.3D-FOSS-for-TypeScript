export class Vector2 {
    private _x: number;
    private _y: number;

    constructor(x: number = 0.0, y: number = 0.0) {
        this._x = Number(x);
        this._y = Number(y);
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

    set(newX: number, newY: number): void {
        this._x = Number(newX);
        this._y = Number(newY);
    }

    get length(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    get length2(): number {
        return this._x * this._x + this._y * this._y;
    }

    static parse(input: string): Vector2 {
        const parts = input.trim().split(/\s+/);
        if (parts.length !== 2) {
            throw new Error(`Invalid Vector2 format: ${input}`);
        }
        return new Vector2(parseFloat(parts[0]), parseFloat(parts[1]));
    }

    getItem(key: number): number {
        if (key === 0) {
            return this._x;
        } else if (key === 1) {
            return this._y;
        } else {
            throw new Error('Vector2 index out of range');
        }
    }

    setItem(key: number, value: number): void {
        if (key === 0) {
            this._x = Number(value);
        } else if (key === 1) {
            this._y = Number(value);
        } else {
            throw new Error('Vector2 index out of range');
        }
    }

    [key: number]: number;

    __repr__(): string {
        return `Vector2(${this._x}, ${this._y})`;
    }

    equals(other: Vector2): boolean {
        return this._x === other._x && this._y === other._y;
    }
}
