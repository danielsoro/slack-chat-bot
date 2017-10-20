'use strict';

const { spawn } = require('child_process');

module.exports = {
    run: function (command, args, cwd) {
        const spawnResult = spawn(`${command}`, args, { cwd: `${cwd}` });

        spawnResult.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        spawnResult.stderr.on('data', (data) => {
            console.log(`${data}`);
        });

        return spawnResult;
    }
};