const { spawnSync } = require('child_process');

module.exports = {
    run: function (env, command, cwd) {
        let spawnResult = spawnSync(`environment=${env}`, ['./action.tsm', command], { cwd: cwd });
        if (spawnResult.error) {
            console.error('stderr', spawnResult.stderr);
            throw spawnResult.error;
        }

        let result = {
            status: spawnResult.status,
            stderr: spawnResult.stderr,
            stdout: spawnResult.stdout
        };
        return result;
    }
};