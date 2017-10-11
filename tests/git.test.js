const chai = require('chai');
const gitObject = require('../src/git');
const { exec } = require('child_process');
const expect = chai.expect;

describe('Git', function() {
    it('git should clone project', function() {
        let url = 'git@github.com:danielsoro/dynamic-inject.git'
        let gitResult = gitObject.clone(url);
        expect(gitResult.status).to.eq(0);
        expect(gitResult.folder).not.null;

        //clear folder created
        exec(`rm -rf ${gitResult.folder}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`[ERROR] ${stdout.toString}`);
                throw err;
            }    
        });
    });
});