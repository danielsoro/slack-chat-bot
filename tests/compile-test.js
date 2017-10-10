const chai = require('chai'),
      compileObject = require('../src/compile');

const expect = chai.expect;

describe('Compile', function() {
    it('compile() should return status equal 0 if build is ok', function() {
        expect(compileObject.compile(0).status).to.eq(0);
    });
});