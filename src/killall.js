'use strict';

const { spawn } = require('child_process');

module.exports = {
    kill: function (what) {
        return spawn(`killall`, [what]);
    }
};