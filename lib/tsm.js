'use strict';

const { exec } = require('child_process');

module.exports = {
    runAction: function (env, command, cwd) {
        let tsmResult = exec(`environment=${env} ./action.tsm ${command} > /dev/null 2>&1`, {cwd: cwd});

        tsmResult.stderr.on('data', (data) => {
            console.log(`${data}`);
        });
        return tsmResult;
    }
};