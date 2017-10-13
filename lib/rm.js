'use strict';

const { spawn } = require('child_process');

module.exports = {
    remove: function (what) {
        return spawn(`rm`, ['-rf', what]);
    }
};