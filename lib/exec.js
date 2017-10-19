'use strict';

const { exec } = require('child_process');

module.exports = {
    run: function (command, cwd) {
        let tsmResult = exec(`${command} > /dev/null 2>&1`, {cwd: cwd});

        tsmResult.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        return tsmResult;
    }
};