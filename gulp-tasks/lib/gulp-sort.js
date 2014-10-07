
var through = require('through2');

module.exports = function(sortFn) {

  var files = [];

  function onFile(file, enc, cb)  {
    files.push(file);
    cb();
  }

  function onEnd(cb) {
    var self = this;

    files.sort(sortFn);

    files.forEach(function(file) {
      self.push(file);
    });

    cb();
  }

  return through.obj(onFile, onEnd);

};
