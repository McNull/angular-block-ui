// Optimised version of https://github.com/fraserxu/gulp-html2js

var path = require('path');
var through = require('through2');
var File = require('vinyl');

var bsRegexp = new RegExp('\\\\', 'g');
var quoteRegexp = new RegExp('\\\"', 'g');
var nlReplace = '\\n\'' + ' +\n    \'';

function escape(content) {
  return content
    .replace(bsRegexp, '\\\\')
    .replace(quoteRegexp, '\\\"')
    .replace(/'/g, '\\\'')
    .replace(/\r?\n/g, nlReplace);
}

function templateCache(content, key) {
  return '$templateCache.put(\'' + key + '\', \'' + escape(content) + '\');'
}

function ensureSlashPath(p) {
  if (path.sep !== '/') {
    p = p.replace(/\\/g, '/')
  }
  return p;
}

/*
    options.base:         base filepath of the template. This value is used as cache key.
    options.moduleName:   the name of the module where to inject the templates.
    options.filename:     [optional] target filename of the result.
 */

module.exports = function (options) {

  var buffer = [];

  function transform(file, encoding, callback) {

    var key = ensureSlashPath(path.relative(options.base, file.path));
    var contents = templateCache(file.contents.toString(), key);

    buffer.push('  ' + contents);
    callback();

  }

  function flush(callback) {

    var contents = 'angular.module(\'' + options.moduleName + '\').run([\'$templateCache\', function($templateCache){\n' +
      buffer.join('\n') + '\n}]);';


    var file = new File({
      path: options.filename || options.moduleName + '-templates.js',
      contents: new Buffer(contents)
    });

    this.push(file);

    return callback();
  }

  return through.obj(transform, flush);
};

