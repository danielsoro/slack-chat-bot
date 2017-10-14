'use strict';

const { spawnSync } = require('child_process');

module.exports = {
    run: function (cwd, options) {
        return spawnSync('mvn', options, { cwd: cwd });
    }
};