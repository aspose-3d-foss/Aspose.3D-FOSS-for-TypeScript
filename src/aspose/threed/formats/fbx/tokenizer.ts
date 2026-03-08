export class FbxTokenizer {
    private _content: string;
    private _pos: number = 0;
    private _tokens: any[] = [];

    constructor(content: string) {
        this._content = content;
    }

    tokenize(): any[] {
        this._tokens = [];
        this._pos = 0;

        while (this._pos < this._content.length) {
            this._skipWhitespace();
            
            if (this._pos >= this._content.length) {
                break;
            }

            const char = this._content[this._pos];

            if (char === ';') {
                this._skipComment();
            } else if (char === '{') {
                this._tokens.push({ type: 'LBRACE', value: '{' });
                this._pos++;
            } else if (char === '}') {
                this._tokens.push({ type: 'RBRACE', value: '}' });
                this._pos++;
            } else if (char === ':') {
                this._tokens.push({ type: 'COLON', value: ':' });
                this._pos++;
            } else if (char === ',') {
                this._tokens.push({ type: 'COMMA', value: ',' });
                this._pos++;
            } else if (char === '"') {
                this._readString();
            } else if (this._isDigit(char) || (char === '-' && this._isDigit(this._content[this._pos + 1]))) {
                this._readNumber();
            } else if (this._isAlpha(char) || char === '_') {
                this._readIdentifier();
            } else {
                this._pos++;
            }
        }

        return this._tokens;
    }

    private _skipWhitespace(): void {
        while (this._pos < this._content.length) {
            const char = this._content[this._pos];
            if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
                this._pos++;
            } else {
                break;
            }
        }
    }

    private _skipComment(): void {
        while (this._pos < this._content.length && this._content[this._pos] !== '\n') {
            this._pos++;
        }
        if (this._pos < this._content.length) {
            this._pos++;
        }
    }

    private _readString(): void {
        this._pos++;
        let value = '';
        while (this._pos < this._content.length && this._content[this._pos] !== '"') {
            if (this._content[this._pos] === '\\' && this._pos + 1 < this._content.length) {
                this._pos++;
                const escaped = this._content[this._pos];
                if (escaped === 'n') {
                    value += '\n';
                } else if (escaped === 't') {
                    value += '\t';
                } else if (escaped === '"') {
                    value += '"';
                } else if (escaped === '\\') {
                    value += '\\';
                } else {
                    value += escaped;
                }
            } else {
                value += this._content[this._pos];
            }
            this._pos++;
        }
        if (this._pos < this._content.length) {
            this._pos++;
        }
        this._tokens.push({ type: 'STRING', value });
    }

    private _readNumber(): void {
        let value = '';
        if (this._content[this._pos] === '-') {
            value += '-';
            this._pos++;
        }

        while (this._pos < this._content.length && this._isDigit(this._content[this._pos])) {
            value += this._content[this._pos];
            this._pos++;
        }

        if (this._pos < this._content.length && this._content[this._pos] === '.') {
            value += '.';
            this._pos++;
            while (this._pos < this._content.length && this._isDigit(this._content[this._pos])) {
                value += this._content[this._pos];
                this._pos++;
            }
        }

        if (this._pos < this._content.length && (this._content[this._pos] === 'e' || this._content[this._pos] === 'E')) {
            value += this._content[this._pos];
            this._pos++;
            if (this._pos < this._content.length && (this._content[this._pos] === '+' || this._content[this._pos] === '-')) {
                value += this._content[this._pos];
                this._pos++;
            }
            while (this._pos < this._content.length && this._isDigit(this._content[this._pos])) {
                value += this._content[this._pos];
                this._pos++;
            }
        }

        this._tokens.push({ type: 'NUMBER', value: parseFloat(value) });
    }

    private _readIdentifier(): void {
        let value = '';
        while (this._pos < this._content.length && (this._isAlphaNum(this._content[this._pos]) || this._content[this._pos] === '_')) {
            value += this._content[this._pos];
            this._pos++;
        }
        this._tokens.push({ type: 'IDENTIFIER', value });
    }

    private _isDigit(char: string): boolean {
        return char >= '0' && char <= '9';
    }

    private _isAlpha(char: string): boolean {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    private _isAlphaNum(char: string): boolean {
        return this._isAlpha(char) || this._isDigit(char);
    }
}
