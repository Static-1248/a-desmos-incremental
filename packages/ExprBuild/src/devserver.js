#!/usr/bin/env node

const path = require('path');
const cwd = process.cwd();
console.log(cwd);

const tsNode = require('ts-node');
tsNode.register({
  project: path.join(cwd, 'tsconfig.json')
});

userModule = require(cwd);
console.log(userModule.default.type);