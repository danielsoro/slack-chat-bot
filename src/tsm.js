'use strict';

const { exec } = require('child_process');

module.exports = {
    runAction: function (env, command, cwd) {
        let tsmResult = exec(`environment=${env} ./action.tsm ${command}`, {cwd: cwd});

        tsmResult.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        return tsmResult;
    }
};