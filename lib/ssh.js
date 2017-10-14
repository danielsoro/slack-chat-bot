'use strict';

const { spawnSync } = require('child_process');

module.exports = {
    sshCommand: function (key, user, server, command) {
        return spawnSync(`ssh`, ['-i', key, `${user}@${server}`, command]);
    }
};