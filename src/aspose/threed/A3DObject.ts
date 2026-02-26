export class A3DObject implements INamedObject {
    private _name: string;
    private _properties: PropertyCollection;

    constructor(name: string = '');
    constructor(name?: string) {
        this._name = name !== undefined ? name : '';
        this._properties = new PropertyCollection();
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = String(value);
    }

    get properties(): PropertyCollection {
        return this._properties;
    }

    findProperty(propertyName: string): Property {
        return this._properties.findProperty(propertyName);
    }

    getProperty(property: string): any {
        return this._properties.get(property);
    }

    setProperty(property: string, value: any): void {
        const existing = this._properties.findProperty(property);
        if (existing) {
            existing.value = value;
        } else {
            const newProp = new Property(property, value);
            this._properties['_properties'].push(newProp);
        }
    }

    removeProperty(property: string | Property): boolean {
        return this._properties.removeProperty(property);
    }

    toString(): string {
        return `${this.constructor.name}(${this._name})`;
    }
}
