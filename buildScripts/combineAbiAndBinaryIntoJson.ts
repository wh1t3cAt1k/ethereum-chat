import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Seq } from 'immutable';

const ethereumBuildPathComponents: readonly string[] = [
    __dirname,
    '..',
    'ethereum',
    'build',
];

/**
 * Combine solcjs output into a single json file.
 *
 * AnonymousChat.abi + AnonymousChat.bin -> AnonymousChat.json
 */
const combineAbiAndBinaryIntoJson = () => {
    Seq.Indexed(
        glob.sync(path.resolve(...ethereumBuildPathComponents, '*.abi'))
    )
        .map(filePath => path.parse(filePath).name)
        .forEach(fileNameWithoutExtension => {
            const abiFilePath = path.resolve(
                ...ethereumBuildPathComponents,
                `${fileNameWithoutExtension}.abi`
            );

            const binaryFilePath = path.resolve(
                ...ethereumBuildPathComponents,
                `${fileNameWithoutExtension}.bin`
            );

            const resultingFilePath = path.resolve(
                ...ethereumBuildPathComponents,
                `${fileNameWithoutExtension}.json`
            );

            const abi = JSON.parse(
                fs.readFileSync(abiFilePath, { encoding: 'utf8' })
            );

            const binary = fs.readFileSync(binaryFilePath, {
                encoding: 'utf8',
            });

            const result: {} = {
                abi,
                binary,
            };

            fs.writeFileSync(resultingFilePath, JSON.stringify(result));
            fs.unlinkSync(abiFilePath);
            fs.unlinkSync(binaryFilePath);
        });
};

combineAbiAndBinaryIntoJson();
