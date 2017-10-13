'use strict';

const { spawn } = require('child_process');

module.exports = {
    compile: function (cwd, options) {
        let compileResult = spawn('mvn', options, { cwd: cwd });

        // deve ir para o log do request do usuário
        compileResult.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        return compileResult;
    }
};