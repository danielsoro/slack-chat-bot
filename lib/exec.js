'use strict';

const { spawn } = require('child_process');

module.exports = {
    run: function (command, args, cwd) {
        const spawnResult = spawn(`${command}`, args, { cwd: `${cwd}` });
        return spawnResult;
    }
};