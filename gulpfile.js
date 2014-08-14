#!/usr/bin/env node

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var config = require('./build-config.js');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

var gulp = require('gulp');

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

require('./gulp-tasks/bower-task.js')(gulp);
require('./gulp-tasks/modules-task.js')(gulp);
require('./gulp-tasks/index-task.js')(gulp);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -

gulp.task('build', [ 'modules', 'bower', 'index' ], function() {

  var path = require('path');

  return gulp.src('README.md')
    .pipe(gulp.dest(path.join(config.folders.dest, 'app')));

});
gulp.task('default', [ 'build' ]);

// - - - - 8-< - - - - - - - - - - - - - - - - - - -