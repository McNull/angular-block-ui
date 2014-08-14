
var svgmin = require('gulp-svgmin');
var path = require('path');

module.exports = function(gulp, module) {
  module.task('svg', 'clean', function () {

    var glob = [
      path.join(module.folders.src, '/**/*.svg'),
      '!**/*.ng.svg',
      '!**/*.ignore.svg'
    ];

    return gulp.src(glob)
      .pipe(module.touch())
      .pipe(svgmin())
      .pipe(gulp.dest(module.folders.dest));

  });

};

