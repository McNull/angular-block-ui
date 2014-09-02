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
        minified.splice(1, 0, 'min');
        minified = minified.join('.');
        minified = path.join(dirname, minified);

        i += 1;
        globs.splice(i, 0, minified);
      }

      // Add the source map file name

      i += 1;
      globs.splice(i, 0, glob + '.map');

    }
  }

//  console.log(globs);
  // If the current build target is production we'll try to grab minified files where possible.

//  if(options.env === 'production') {
//    globs = globs.map(function(glob) {
//
//      var ext = path.extname(glob);
//
//      if(ext === '.js' || ext === '.css') {
//        return getMinifiedFilename(glob, { exists: true });
//      } else {
//        return glob;
//      }
//
//    });
//  }

  return gulp.src(globs, options);
}

function getMinifiedFilename(filename, opts) {

  opts = opts || {};

  var dirname = path.dirname(filename);
  var basename = path.basename(filename);

  var minified = basename.split('.');
  minified.splice(1, 0, 'min');
  minified = minified.join('.');
  minified = path.join(dirname, minified);

  if(opts.exists && !fs.existsSync(minified)) {
    return filename;
  }

  return minified;
}
