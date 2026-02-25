describe('verifyModule', () => {
    it('testModuleStructure', () => {
        const { Vector3, Quaternion, Matrix4 } = require('../src/aspose/threed/utilities');

        const v = new Vector3(1.0, 2.0, 3.0);
        const q = new Quaternion(1.0, 0.0, 0.0, 0.0);
        const m = new Matrix4();

        expect(v).toBeDefined();
        expect(q).toBeDefined();
        expect(m).toBeDefined();
    });

    it('testCoreClasses', () => {
        const { Scene, Node, Entity, Transform, GlobalTransform } = require('../src/aspose/threed');

        const scene = new Scene();
        const node = new Node("test");
        const entity = new Mesh("mesh");

        expect(scene).toBeDefined();
        expect(node).toBeDefined();
        expect(entity).toBeDefined();
    });
});
