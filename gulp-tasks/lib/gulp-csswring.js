#!/usr/bin/env node

var through = require('through2');
var csswring = require('csswring');
var applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function(options) {

  options = options || {};

  return through.obj(function(file, enc, cb) {

    if(file.isStream()) {
      throw new Error('Streams are not supported.');
    }

    if (!file.isNull()) {

      if(file.sourceMap) {
        options.map = {
          prev: file.sourceMap.mappings ? file.sourceMap : undefined,
          annotation: false,
          sourcesContent: true
        };
        options.from =
        options.to = file.relative;
      }

      var contents = file.contents.toString();

      var result = csswring().wring(contents, options);

      file.contents = new Buffer(result.css);

      if(file.sourceMap) {
        var map = JSON.parse(result.map.toString());

        map.sources = file.sourceMap.sources;
        map.file = file.sourceMap.file;

//        applySourceMap(file, map);
        file.sourceMap = map;
      }
    }

    this.push(file);
    cb();

  });
};