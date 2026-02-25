import { Scene } from '../src/aspose/threed';
import { ColladaLoadOptions } from '../src/aspose/threed/formats/collada';
import * as fs from 'fs';
import * as path from 'path';

describe('TestColladaImporterMultipleFiles', () => {
    it('testImportMultipleFiles', () => {
        const options = new ColladaLoadOptions();

        const examples_dir = path.join(__dirname, '../../../foss.python/examples/collada');

        if (fs.existsSync(examples_dir)) {
            const dae_files = fs.readdirSync(examples_dir)
                .filter(file => file.endsWith('.dae'))
                .slice(0, 5)
                .map(file => path.join(examples_dir, file));

            for (const dae_file of dae_files) {
                expect(() => {
                    const scene = new Scene();
                    scene.open(dae_file, options);

                    expect(scene.rootNode).toBeDefined();
                    expect(scene.rootNode.childNodes.length > 0).toBe(true);
                }).not.toThrow(`Failed to import ${path.basename(dae_file)}`);
            }
        } else {
            pending(`Examples directory not found: ${examples_dir}`);
        }
    });
});
