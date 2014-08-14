var File = require('vinyl');
var through = require('through2');

//  options = {
//    header: {
//      contents: '/* my header */',
//      path: 'my-virtual-header.js'
//    } || '/* my header */,
//    footer: {
//      contents: '/* my footer */',
//      path: 'my-virtual-footer.js'
//    } || '/* my footer */
//  };

module.exports = function (options) {

  var pushedHeader = false;

  function pushHeader(file, enc, cb) {

    if (!pushedHeader) {
      pushedHeader = true;

      if (typeof(options.header) == 'string') {
        options.header = {
          contents: options.header
        };
      }

      if (options.header.contents === undefined) {
        throw new Error('No header content provided.');
      }

      var headerFile = new File({
        path: options.header.path || 'header',
        contents: new Buffer(options.header.contents)
      });

      this.push(headerFile);
    }

    this.push(file);
    cb();

  }

  function pass(file, enc, cb) {
    this.push(file);
    cb();
  }

  function pushFooter(cb) {

    if (typeof(options.footer) == 'string') {
      options.footer = {
        contents: options.footer
      };
    }

    if (options.header.contents === undefined) {
      throw new Error('No header content provided.');
    }

    var footerFile = new File({
      path: options.footer.path || 'footer',
      contents: new Buffer(options.footer.contents)
    });

    this.push(footerFile);

    cb();
  }

  return through.obj(
    options.header ? pushHeader : pass,
    options.footer ? pushFooter : undefined
  );
};