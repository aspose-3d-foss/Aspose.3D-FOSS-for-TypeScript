export class ParseException extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'ParseException';
    }
}
