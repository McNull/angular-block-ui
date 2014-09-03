
var path = require('path');
var filter = require('../lib/gulp-mini-filter.js');

module.exports = function(gulp, module) {

  module.task('copy', ['scripts', 'styles', 'svg'], function () {

    var glob = [
      path.join(module.folders.src, '/**/*'),
      '!**/*.test.js',
      '!**/*.ignore.*'
    ];

    module.touched.forEach(function (filename) {
      glob.push('!' + filename);
    });

    return gulp.src(glob)
      .pipe(filter(function(file) {
        // Only copy files -- don't copy empty directories
        return file.stat.isFile();
      }))
      .pipe(gulp.dest(module.folders.dest));

  });

};

