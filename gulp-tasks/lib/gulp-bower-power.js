#!/usr/bin/env node

var path = require('path');
var fs = require('fs');

var mainBowerFiles = require('main-bower-files');

module.exports = {
  src: src
};

function src(gulp, options) {

  options = options || {};

  // Grab globs from main-bower-files module.
  // This sorts out the dependencies.

  var globs = mainBowerFiles(options);

  for(var i = 0; i < globs.length; i++) {

    var glob = globs[i];

    var ext = path.extname(glob);

    // Check if the extension is JS or css
    if(ext === '.js' || ext === '.css') {

      if(glob.indexOf('.min') == -1) {
        // Add the minified version file name to the list
        var dirname = path.dirname(glob);
        var basename = path.basename(glob);

        var minified = basename.split('.');
        minified.splice(minified.length - 1, 0, 'min');
        minified = minified.join('.');
        minified = path.join(dirname, minified);

        i += 1;
        globs.splice(i, 0, minified);

        // Add the source map file name for the minified version

        i += 1;
        globs.splice(i, 0, minified + '.map');
      }

      // Add the source map file name for the unminified version

      i += 1;
      globs.splice(i, 0, glob + '.map');

    }
  }

  return gulp.src(globs, options);
}

