// - - - - - 8-< - - - - - - - - - - - - - -

var _ = require('lodash');

// - - - - - 8-< - - - - - - - - - - - - - -

var pkg = require('./package.json');
pkg.year = pkg.year || new Date().getFullYear();

// - - - - - 8-< - - - - - - - - - - - - - -

var config = {

  /* 'production' || 'development' */
  env: process.env.NODE_ENV,

  folders: {
    dest: 'dest/',
    src: 'src/'
  },

  modules: [
    {
      name: 'angular-block-ui',
      alias: 'blockUI'
    },
//    {
//      name: 'angular-delay',
//      alias: 'delay'
//    },
//    {
//      name: 'angular-showdown',
//      alias: 'showdown'
//    },
    {
      name: 'app',
      alias: 'myApp'
    }
  ],

  bower: {
    includeDev: true
  },

  header: _.template([
    '/*!',
    '   <%= pkg.name %> v<%= pkg.version %>',
    '   (c) <%= pkg.year %> <%= pkg.author %> <%= pkg.homepage %>',
    '   License: <%= pkg.license %>',
    '*/\n'
  ].join('\n'), { pkg: pkg })

};

// - - - - - 8-< - - - - - - - - - - - - - -

module.exports = config;