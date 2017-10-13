'use strict';

const { spawn } = require('child_process');

module.exports = {
    run: function (cwd, options) {
        let compileResult = spawn('mvn', options, { cwd: cwd });

        compileResult.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        return compileResult;
    }
};