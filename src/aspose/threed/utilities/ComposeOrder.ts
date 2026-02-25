export class ComposeOrder {
    static readonly APPEND = new ComposeOrder('APPEND');
    static readonly PREPEND = new ComposeOrder('PREPEND');

    private _name: string;

    private constructor(name: string) {
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    toString(): string {
        return this._name;
    }
}
