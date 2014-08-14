#!/usr/bin/env node

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var config = require('./build-config.js');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

require('./gulp-tasks/bower-task.js')(gulp);
require('./gulp-tasks/modules-task.js')(gulp);
require('./gulp-tasks/index-task.js')(gulp);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -
// Builds the whole kitchensink including example website

gulp.task('kitchensink', [ 'modules', 'bower', 'index' ], function () {

  var path = require('path');

  return gulp.src('README.md')
    .pipe(gulp.dest(path.join(config.folders.dest, 'app')));

});

// - - - - 8-< - - - - - - - - - - - - - - - - - - -



// - - - - 8-< - - - - - - - - - - - - - - - - - - -

gulp.task('dist-clean', ['angular-block-ui-clean'], function () {

  return gulp.src('dist/**/*', { read: false }).pipe(clean());

});

gulp.task('dist', ['dist-clean', 'angular-block-ui'], function () {

  var destGlob = path.join(config.folders.dest, 'angular-block-ui/**/*');
  return gulp.src([ destGlob, 'README.md', '!**/angular-block-ui-templates.js' ])
    .pipe(gulp.dest('dist'));

});

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

gulp.task('default', [ 'dist' ]);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -