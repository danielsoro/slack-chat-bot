const { spawnSync } = require('child_process');

module.exports = {
    compile: function (cwd) {
        let spawnResult = spawnSync('mvn', ['clean', 'install'], { cwd: cwd });
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