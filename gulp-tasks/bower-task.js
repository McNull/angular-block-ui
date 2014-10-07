#!/usr/bin/env node

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var path = require('path');
var clean = require('gulp-rimraf');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var bower = require('./lib/gulp-bower-power.js');
var config = require('../build-config.js');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

module.exports = function(gulp) {
  gulp.task('bower-clean', function () {

    return gulp.src(path.join(config.folders.dest, 'vendor'), { read: false })
      .pipe(clean());

  });

  gulp.task('bower', ['bower-clean'], function () {

    return bower.src(gulp, { env: config.env, includeDev: config.bower && config.bower.includeDev })
      .pipe(gulp.dest(path.join(config.folders.dest, 'vendor')));

  });
};

// - - - - 8-< - - - - - - - - - - - - - - - - - - -
