import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';
import { Seq } from 'immutable';

/**
 * Normalize the contract filenames stripping the unnecessary underscore components
 * generated by solcjs. For example: 
 * 
 * ethereum_src_Chat_sol_AnonymousChat.abi -> AnonymousChat.abi
 */

Seq.Indexed(glob.sync(`${__dirname}/../ethereum/build/*.*`)).forEach(fileName => {
    const baseName = path.basename(fileName);
    const dirName = path.dirname(fileName);

    const baseNameLastUnderscoreComponent = Seq.Indexed(
        baseName.split('_')
    ).last(fileName);

    fs.renameSync(
        fileName,
        path.resolve(dirName, baseNameLastUnderscoreComponent)
    );
});
