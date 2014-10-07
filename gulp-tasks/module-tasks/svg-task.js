
var svgmin = require('gulp-svgmin');
var path = require('path');

module.exports = function(gulp, module) {

  module.task('svg-clean', function() {

    var outputFiles = [
      path.join(module.folders.dest, '**/*.svg')
    ];

    var clean = require('gulp-rimraf');

    return gulp.src(outputFiles, { read: false })
      .pipe(clean({ force: true }));

  });

  module.task('svg', 'svg-clean', function () {

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

