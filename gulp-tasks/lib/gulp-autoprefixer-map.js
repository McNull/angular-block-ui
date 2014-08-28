#!/usr/bin/env node

/*
  Hack to enable source maps in with gulp-sourcemaps and autoprefixer.

  Created by null on 12/08/14.

  npm --save-dev install through2
  npm --save-dev install autoprefixer
  npm --save-dev install vinyl-sourcemaps-apply

  var prefixer = require('./gulp-autoprefixer-map.js');

  gulp.task('css', [], function() {
     .pipe(sourcemaps.init())
     .pipe(prefixer())
     .pipe(sourcemaps.write('.'))
  });

 */

var through = require('through2');
var prefix = require('autoprefixer');
//var applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function(browsers, options) {

  options = options || {};

  return through.obj(function(file, enc, cb) {

    if(file.isStream()) {
      throw new Error('Streams not supported');
    }

    if(!file.isNull()) {

      if(file.sourceMap) {
        options.map = {
          prev: file.sourceMap.mappings ? file.sourceMap : undefined,
          annotation: false,
          sourcesContent: true
        };
        options.to = options.from = file.relative;
      }

      var contents = file.contents.toString();

      var result = prefix.apply(this, browsers).process(contents, options);
      contents = result.css;

      file.contents = new Buffer(contents);

      if(file.sourceMap) {
        var map = JSON.parse(result.map.toString());

        map.sources = file.sourceMap.sources;
        map.file = file.sourceMap.file;

        file.sourceMap = map;

        //applySourceMap(file, map);
      }
    }

    this.push(file);
    cb();

  });

};
