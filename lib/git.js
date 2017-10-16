'use strict';

const { spawn, spawnSync } = require('child_process');
const uuidv1 = require('uuid/v1');

module.exports = {
    clone: function (user, password, userRepo, project) {
        // Create temp folder
        let folderName = uuidv1();
        let mkdirResult = spawnSync('mkdir', ['-p', folderName], { cwd: '/tmp/' });
        let gitResult;
        let gitTmpFolder = `/tmp/${folderName}`;

        if (mkdirResult.status == 0) {
            let url = `https://${user}:${password}@github.com/${userRepo}/${project}.git`;
            gitResult = spawn('git', ['clone', url], { cwd: gitTmpFolder });
        }

        const log = [];
        gitResult.stdout.on('data', (data) => {
            log.push(data);
        });

        let result = {
            folder: gitTmpFolder,
            projectName: project,
            gitResult,
            log
        };

        return result;
    }
};