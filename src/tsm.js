'use strict';

const { exec } = require('child_process');

module.exports = {
    runAction: function (env, command, cwd) {
        return exec(`environment=${env} ./action.tsm ${command}`, {cwd: cwd});
    }
};