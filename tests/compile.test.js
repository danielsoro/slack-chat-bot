const chai = require('chai');
const compileObject = require('../src/compile');
const expect = chai.expect;

describe('Compile', function() {
    it('compile() should return status equal 1 if build is not ok', function() {
        expect(compileObject.compile(`${__dirname}/projects/mvn-error/fail`).status).to.eq(1);
    });

    it ('compile() should return status equal 0 if build is ok', function() {
        expect(compileObject.compile(`${__dirname}/projects/mvn-ok/ok`).status).to.eq(0);
    })
});