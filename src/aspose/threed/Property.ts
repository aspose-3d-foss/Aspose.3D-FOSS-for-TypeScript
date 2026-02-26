export class Property {
    private _name: string;
    private _value: any;
    private _extraData: Map<string, any>;

    constructor(name: string, value: any = null) {
        this._name = name;
        this._value = value;
        this._extraData = new Map<string, any>();
    }

    get name(): string {
        return this._name;
    }

    get value(): any {
        return this._value;
    }

    set value(val: any) {
        this._value = val;
    }

    get valueType(): any {
        return this._value !== null ? typeof this._value : 'null';
    }

    getExtra(name: string): any {
        return this._extraData.get(name);
    }

    setExtra(name: string, value: any): void {
        this._extraData.set(name, value);
    }

    toString(): string {
        return `Property(${this._name}, ${this._value})`;
    }
}
