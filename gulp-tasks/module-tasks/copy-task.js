
var path = require('path');

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
      .pipe(gulp.dest(module.folders.dest));

  });

};

