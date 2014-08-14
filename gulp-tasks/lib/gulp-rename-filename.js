
var path = require('path');
var through = require('through2');

function rename(filename) {
  return through.obj(function(file, enc, cb) {

    file.path = path.join(file.base, filename);

    if(file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    this.push(file);
    cb();
  });
}

module.exports = rename;