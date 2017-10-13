'use strict';

const { spawn } = require('child_process');

module.exports = {
    sshCommand: function (key, user, server, command) {
        return spawn(`ssh`, ['-i', key, `${user}@${server}`, command]);
    }
};