
var _ = require('lodash');

var files = {

  addArea: function(taskname, areaname) {
    areaname = areaname || taskname;
    var area = {};

    area[taskname] = {
      js: [
        areaname + '/' + areaname + '.js',
        areaname + '/**/*.js',
        '!' + areaname + '/**/*.test.js'
      ],
      css: [
        areaname + '/' + areaname + '.css',
        areaname + '/**/*.css'
      ],
      test: [
        areaname + '/**/*.test.js'
      ],
      other: [
        areaname + '/**/*.png',
        areaname + '/**/*.jpg',
        areaname + '/**/*.html',
        '!' +areaname + '/**/*.tmpl.html',
        areaname + '/**/*.json'
      ],
      html2js: [
        areaname + '/templates-' + areaname + '.js'
      ]
    };

    return _.extend(this, area);
  },

  vendor: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-route/angular-route.js',
      'vendor/lodash/dist/lodash.js',
      'vendor/showdown/src/showdown.js'
    ],
    test: [
      'vendor/angular/angular.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/angular-resource/angular-resource.js',
      'vendor/angular-route/angular-route.js',
      'vendor/lodash/dist/lodash.js',
      'vendor/showdown/src/showdown.js'
    ],
    css: [
      'vendor/bootstrap-css/css/bootstrap.css',
      'vendor/bootstrap-css/css/bootstrap-responsive.css'
    ],
    other: [
      'vendor/**/*.png',
      'vendor/**/*.jpg'
    ]
  }
};

module.exports = files;