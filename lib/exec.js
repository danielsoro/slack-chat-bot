'use strict';

const { exec } = require('child_process');

module.exports = {
    run: function (command, cwd) {
        let execResult = exec(`${command} > /dev/null 2>&1`, { cwd: cwd }, (err, stdout, sterr) => {
            if (err) {
                return { err };
            }
            return { err, stdout, sterr };
        });

        return execResult;
    }
};