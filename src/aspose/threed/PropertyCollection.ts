export class PropertyCollection {
    protected _properties: Property[] = [];

    get count(): number {
        return this._properties.length;
    }

    findProperty(propertyName: string): Property | null {
        for (const prop of this._properties) {
            if (prop.name === propertyName) {
                return prop;
            }
        }
        return null;
    }

    get(property: string): any {
        const prop = this.findProperty(property);
        return prop ? prop.value : null;
    }

    removeProperty(property: string | Property): boolean {
        if (typeof property === 'string') {
            const prop = this.findProperty(property);
            if (prop) {
                const index = this._properties.indexOf(prop);
                if (index > -1) {
                    this._properties.splice(index, 1);
                    return true;
                }
            }
            return false;
        } else if (property instanceof Property) {
            const index = this._properties.indexOf(property);
            if (index > -1) {
                this._properties.splice(index, 1);
                return true;
            }
            return false;
        }
        return false;
    }

    getItem(key: number): Property {
        return this._properties[key];
    }

    get length(): number {
        return this._properties.length;
    }

    [Symbol.iterator](): Iterator<Property> {
        return this._properties[Symbol.iterator]();
    }

    __repr__(): string {
        return `PropertyCollection(${this._properties.length} properties)`;
    }
}
