'use strict';

const { exec } = require('child_process');

module.exports = {
    run: function (command, cwd) {
        let execResult = exec(`${command} > /dev/null 2>&1`, {cwd: cwd}, (err, stdout, sterr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
              }
              console.log(`stdout: ${stdout}`);
              console.log(`stderr: ${stderr}`);
        });
       return execResult
    }
};