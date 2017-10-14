'use strict';

const { spawnSync } = require('child_process');

module.exports = {
    kill: function (what) {
        return spawnSync(`killall`, [what]);
    }
};