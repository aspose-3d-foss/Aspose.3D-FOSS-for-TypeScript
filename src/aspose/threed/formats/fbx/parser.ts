export interface FbxProperty {
    name: string;
    value: any;
    properties: FbxProperty[];
}

export class FbxElement {
    constructor(public properties: FbxProperty[]) {}

    getFirstElement(name: string): FbxElement | null {
        const prop = this.properties.find(p => p.name === name);
        return prop ? new FbxElement(prop.properties) : null;
    }

    getElements(name: string): FbxElement[] {
        return this.properties
            .filter(p => p.name === name)
            .map(p => new FbxElement(p.properties));
    }

    get compound(): FbxElement | null {
        return this.properties.length > 0 ? this : null;
    }

    get tokens(): { text: string }[] {
        const tokens: { text: string }[] = [];
        for (const prop of this.properties) {
            if (prop.value !== null && prop.value !== undefined) {
                if (Array.isArray(prop.value)) {
                    for (const v of prop.value) {
                        tokens.push({ text: String(v) });
                    }
                } else {
                    tokens.push({ text: String(prop.value) });
                }
            }
        }
        return tokens;
    }
}

export class FbxParser {
    private _tokens: any[];
    private _pos: number = 0;
    private _rootScope: FbxProperty | null = null;

    constructor(tokens: any[]) {
        this._tokens = tokens;
    }

    get rootScope(): FbxElement | null {
        if (!this._rootScope) {
            return null;
        }
        return new FbxElement([this._rootScope]);
    }

    parse(_data?: any): FbxProperty {
        this._pos = 0;
        this._rootScope = this._parseProperty();
        return this._rootScope;
    }

    private _currentToken(): any | null {
        if (this._pos < this._tokens.length) {
            return this._tokens[this._pos];
        }
        return null;
    }

    private _consumeToken(): any | null {
        const token = this._currentToken();
        if (token) {
            this._pos++;
        }
        return token;
    }

    private _expectToken(type: string): any {
        const token = this._currentToken();
        if (!token || token.type !== type) {
            throw new Error('Expected token type ' + type + ' but got ' + (token ? token.type : 'EOF'));
        }
        this._pos++;
        return token;
    }

    private _parseProperty(): FbxProperty {
        const nameToken = this._currentToken();
        if (!nameToken || nameToken.type !== 'IDENT') {
            throw new Error('Expected property name');
        }
        const name = nameToken.value;
        this._pos++;

        this._expectToken('COLON');

        const value = this._parseValue();

        const property: FbxProperty = {
            name,
            value,
            properties: []
        };

        if (this._currentToken() && this._currentToken().type === 'LBRACE') {
            this._consumeToken();
            while (this._currentToken() && this._currentToken().type !== 'RBRACE') {
                const child = this._parseProperty();
                property.properties.push(child);
            }
            this._expectToken('RBRACE');
        }

        return property;
    }

    private _parseValue(): any {
        const token = this._currentToken();
        if (!token) {
            return null;
        }

        if (token.type === 'NUMBER') {
            this._pos++;
            if (this._currentToken() && this._currentToken().type === 'COMMA') {
                const values: number[] = [token.value];
                while (this._currentToken() && this._currentToken().type === 'COMMA') {
                    this._pos++;
                    const nextToken = this._currentToken();
                    if (nextToken && nextToken.type === 'NUMBER') {
                        values.push(nextToken.value);
                        this._pos++;
                    }
                }
                return values;
            }
            return token.value;
        }

        if (token.type === 'STRING') {
            this._pos++;
            if (this._currentToken() && this._currentToken().type === 'COMMA') {
                const values: string[] = [token.value];
                while (this._currentToken() && this._currentToken().type === 'COMMA') {
                    this._pos++;
                    const nextToken = this._currentToken();
                    if (nextToken && nextToken.type === 'STRING') {
                        values.push(nextToken.value);
                        this._pos++;
                    }
                }
                return values;
            }
            return token.value;
        }

        if (token.type === 'IDENT') {
            const values: (string | number)[] = [token.value];
            this._pos++;
            while (this._currentToken() && this._currentToken().type === 'COMMA') {
                this._pos++;
                const nextToken = this._currentToken();
                if (nextToken) {
                    if (nextToken.type === 'IDENT') {
                        values.push(nextToken.value);
                    } else if (nextToken.type === 'NUMBER') {
                        values.push(nextToken.value);
                    }
                    this._pos++;
                }
            }
            return values.length === 1 ? values[0] : values;
        }

        return null;
    }
}
