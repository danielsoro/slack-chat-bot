'use strict';

const { spawn, spawnSync } = require('child_process');
const uuidv1 = require('uuid/v1');

module.exports = {
    clone: function (user, password, project) {
        // Create temp folder
        let folderName = uuidv1();
        let mkdirResult = spawnSync('mkdir', ['-p', folderName], { cwd: '/tmp/' });
        let gitResult;
        let gitTmpFolder = `/tmp/${folderName}`;

        if (mkdirResult.status == 0) {
            let url = `git@github.com:${user}/${project}.git`;
            gitResult = spawn('git', ['clone', url], { cwd: gitTmpFolder });
        }

        let result = {
            folder: gitTmpFolder,
            projectName: project,
            gitResult: gitResult
        };

        return result;
    }
};