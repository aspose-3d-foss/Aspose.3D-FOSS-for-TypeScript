export class FVector2 {
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

    toString(): string {
        return `FVector2(${this._x}, ${this._y})`;
    }

    equals(other: FVector2): boolean {
        return this._x === other._x && this._y === other._y;
    }

    add(other: FVector2): FVector2 {
        if (!(other instanceof FVector2)) {
            throw new TypeError('Can only add another FVector2');
        }
        return new FVector2(this._x + other._x, this._y + other._y);
    }

    sub(other: FVector2): FVector2 {
        if (!(other instanceof FVector2)) {
            throw new TypeError('Can only subtract another FVector2');
        }
        return new FVector2(this._x - other._x, this._y - other._y);
    }

    mul(scalar: number): FVector2 {
        return new FVector2(this._x * scalar, this._y * scalar);
    }

    div(scalar: number): FVector2 {
        if (scalar === 0) {
            throw new Error('Cannot divide by zero');
        }
        return new FVector2(this._x / scalar, this._y / scalar);
    }

    length(): number {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }

    normalize(): FVector2 {
        const length = this.length();
        if (length > 0) {
            return new FVector2(this._x / length, this._y / length);
        }
        return new FVector2(0.0, 0.0);
    }

    dot(other: FVector2): number {
        return this._x * other._x + this._y * other._y;
    }

    static parse(input: string): FVector2 {
        const parts = input.trim().split(/\s+/);
        if (parts.length !== 2) {
            throw new Error(`Invalid Vector2 format: ${input}`);
        }
        return new FVector2(parseFloat(parts[0]), parseFloat(parts[1]));
    }
}
