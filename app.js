#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
const version = '0.0.1-SNAPSHOT'
const description =  'An application to build the environment'
const compileObject = require('./src/compile');

program
  .version(version)
  .description(description)
  .option("-c, --compile <path>", "Compile application")
  .parse(process.argv);
  
console.log(program.args);
var compile = true === program.compile
? ''
: compileObject.compile(program.compile);