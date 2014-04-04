
var _ = require('lodash');

var files = {

  addArea: function(taskname, areaname) {
    
    areaname = areaname || taskname;
    
    var area = {};

    area[taskname] = {
      js: areaname + '/' + areaname + '.min.js',
      jsSrc: [
        'src/' + areaname + '/' + areaname + '.js',
        'src/' + areaname + '/**/*.js',
        '!src/' + areaname + '/**/*.test.js'
      ],
      css: areaname + '/' + areaname + '.min.css',
      cssSrc: [
        'src/' + areaname + '/' + areaname + '.css',
        'src/' + areaname + '/**/*.css'
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
      'vendor/angular/angular.min.js',
      'vendor/angular-resource/angular-resource.min.js',
      'vendor/angular-route/angular-route.min.js',
      'vendor/lodash/dist/lodash.min.js',
      'vendor/showdown/compressed/showdown.js'
    ],
    test: [
      'vendor/angular/angular.js',
      'vendor/angular-resource/angular-resource.min.js',
      'vendor/angular-route/angular-route.min.js',
      'vendor/angular-mocks/angular-mocks.js',
      'vendor/lodash/dist/lodash.min.js',
      'vendor/showdown/compressed/showdown.js'
    ],
    css: [
      'vendor/bootstrap-css/css/bootstrap.min.css',
      'vendor/bootstrap-css/css/bootstrap-responsive.min.css'
    ],
    other: [
      'vendor/**/*.png',
      'vendor/**/*.jpg'
    ]
  }
};

module.exports = files;
