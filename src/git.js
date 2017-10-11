const { spawnSync } = require('child_process');
const uuidv1 = require('uuid/v1');

module.exports = {
    clone: function (url) {
        // Create temp folder
        let folderName = uuidv1();
        let mkdirResult = spawnSync('mkdir', ['-p', folderName], { cwd: '/tmp/' });
        if (mkdirResult.error) {
            console.error('stderr', mkdirResult.stderr)
            throw mkdirResult.error;
        }

        let gitTmpFolder = `/tmp/${folderName}`
        let gitResult = spawnSync('git', ['clone', url], { cwd: gitTmpFolder });
        if (gitResult.error) {
            console.error('stderr', gitResult.stderr);
            throw gitResult.error;
        }

        let result = {
            status: gitResult.status,
            stderr: gitResult.stderr,
            stdout: gitResult.stdout,
            folder: gitTmpFolder
        };
        return result;
    }
};