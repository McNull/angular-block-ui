var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var path = require('path');

var wrap = require('../lib/gulp-wrap-src.js');
var config = require('../../build-config.js');
var rename = require('../lib/gulp-rename-filename.js');
var filter = require('../lib/gulp-mini-filter.js');

module.exports = function (gulp, module) {

  module.task('scripts', ['clean', 'templates'], function () {

      // At the moment of writing, generating and consuming source maps isn't optimal. Compile tools merge previous
      // maps incorrectly, browsers aren't 100% certain about breakpoint locations and are unable to unmangle
      // argument names. The most stable seems to be to uglify and map in two stages:

      //    1. concat all js in one file and persist to the filesystem
      //    2. uglify the previous file and point point the content of the source map to the original file.

      var jsGlob = [
        path.join(module.folders.src, module.name + '.js'),
        path.join(module.folders.src, '**/*.js'),
        path.join(module.folders.dest, module.name + '-templates.js'),
        '!**/*.test.js',
        '!**/*.ignore.js'
      ];

      return gulp.src(jsGlob)
        .pipe(module.touch())
        .pipe(wrap({
          header: {
            path: module.name + '-header.js',
            contents: config.header + '(function(angular) {\n'
          },
          footer: {
            path: module.name + '-footer.js',
            contents: '})(angular);'
          }
        }))
        .pipe(sourcemaps.init())
        .pipe(concat(module.name + '.js'))
        .pipe(ngAnnotate())
        .pipe(sourcemaps.write('.', { sourceRoot: '../src/' + module.name }))
        .pipe(gulp.dest(module.folders.dest))

        // Create the minified version

        .pipe(sourcemaps.init())
        .pipe(filter(function(file) {

          // Filter out the previous map file.
          return path.extname(file.path) != '.map';

        }))
        .pipe(rename(module.name + '.min.js'))
        .pipe(uglify({ preserveComments: 'some' }))
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: './' }))
        .pipe(gulp.dest(module.folders.dest));
    }
  );
};

