export class FbxParser {
    constructor(_tokens: any[]) {
    }
    
    get rootScope(): any {
        return null;
    }
    
    parse(_data: any): any {
        throw new Error('FbxParser.parse is not implemented');
    }
}
