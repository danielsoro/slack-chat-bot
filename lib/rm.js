'use strict';

const { spawn } = require('child_process');

module.exports = {
    remove: function (what) {
        return spawnSync(`rm`, ['-rf', what]);
    }
};