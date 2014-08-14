
var clean = require('gulp-clean');

module.exports = function(gulp, module) {

  module.task('clean', function () {

    return gulp.src(module.folders.dest, { read: false })
      .pipe(clean({ force: true }));

  });


};