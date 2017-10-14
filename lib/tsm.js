'use strict';

const { execSync } = require('child_process');

module.exports = {
    runAction: function (env, command, cwd) {
        return execSync(`environment=${env} ./action.tsm ${command} > /dev/null 2>&1`, {cwd: cwd});
    }
};