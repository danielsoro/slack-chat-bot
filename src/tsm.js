'use strict';

const { spawn } = require('child_process');

module.exports = {
    runAction: function (env, command, cwd) {
        return spawn(`environment=${env}`, ['./action.tsm', command], { cwd: cwd });
    }
};