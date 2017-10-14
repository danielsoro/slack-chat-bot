'use strict';

const { spawnSync } = require('child_process');
const uuidv1 = require('uuid/v1');

module.exports = {
    clone: function (user, password, userRepo, project) {
        let folderName = uuidv1();
        let mkdirResult = spawnSync('mkdir', ['-p', folderName], { cwd: '/tmp/' });
        let gitTmpFolder = `/tmp/${folderName}`;

        if (mkdirResult.status == 0) {
            let url = `https://${user}:${password}@github.com/${userRepo}/${project}.git`;
        }

        let gitResult = spawnSync('git', ['clone', url], { cwd: gitTmpFolder });

        let result = {
            folder: gitTmpFolder,
            projectName: project,
            gitResult: gitResult
        };

        return result;
    }
};