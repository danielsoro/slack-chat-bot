#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
const version = '0.0.1-SNAPSHOT'
const description =  'An application to build the environment'

program
  .version(version)
  .description(description)
  .parse(process.argv);
  
console.log(program.args);