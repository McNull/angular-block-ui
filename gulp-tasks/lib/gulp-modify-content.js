#!/usr/bin/env node

var through = require('through2');

module.exports = function modify(modifiers) {

  return through.obj(function(file, encoding, done) {

    var stream = this;

    function applyModifiers(content) {
      (typeof modifiers === 'function' ? [modifiers] : modifiers).forEach(function(modifier) {
        content = modifier(content, file);
      });
      return content;
    }

    function write(data) {
      file.contents = new Buffer(data);
      stream.push(file);
      return done();
    }

    if (file.isBuffer()) {
      return write(applyModifiers(String(file.contents)));
    } else if (file.isStream()) {
      var buffer = '';
      file.contents.on('data', function(chunk) {
        buffer += chunk;
      });
      file.contents.on('end', function() {
        write(applyModifiers(String(buffer)));
      });
    }
  });
};