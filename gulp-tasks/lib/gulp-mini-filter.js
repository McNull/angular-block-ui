#!/usr/bin/env node

var through = require('through2');

module.exports = function filter(fn) {
  return through.obj(function(file, enc, cb) {

    if(fn(file)) {
      this.push(file);
    }

    cb();
  });
};