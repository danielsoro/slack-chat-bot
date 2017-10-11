'use strict';

const { spawn } = require('child_process');

module.exports = {
    compile: function (cwd, options) {
        return spawn('mvn', options, { cwd: cwd });
    }
};