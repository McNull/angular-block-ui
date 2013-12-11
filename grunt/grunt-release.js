var _ = require('lodash');

module.exports = function (grunt) {

  var gruntCommon = require('./grunt-common')(grunt);

  var gruntConfig = {
    html2js: {},
    ngmin: {},
    uglify: {},
    cssmin: {},
    copy: {
      vendor: {
        src: [
          '<%= files.vendor.js %>', '<%= files.vendor.css %>', '<%= files.vendor.other %>'
        ],
        dest: 'dist/'
      }
    }
  };

  var areas = [];

  return {
    addArea: function(taskname, areaname) {

      areaname = areaname || taskname;

      gruntCommon.addArea(taskname, areaname);
      areas.push(taskname);

      gruntConfig.html2js[taskname] = {
        src: ['src/' + areaname + '/**/*.tmpl.html'],
        dest: 'tmp/' + areaname + '/templates-app.js'
      };

      gruntConfig.ngmin[taskname] = {
        src: [ '<%= files.' + taskname + '.jsSrc %>' ],
        dest: 'tmp/' + areaname + '/' + areaname + '.ngmin.js'
      };

      gruntConfig.uglify[taskname] = {
        src: [ '<%= ngmin.' + taskname + '.dest %>', '<%= html2js.' + taskname + '.dest %>' ],
        dest: 'dist/<%= files.' + taskname + '.js %>'
      };

      gruntConfig.cssmin[taskname] = {
        src: [ '<%= files.' + taskname + '.cssSrc %>' ],
        dest: 'dist/<%= files.' + taskname + '.css %>'
      };
    
      gruntConfig.copy[taskname] = {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [ '<%= files.' + taskname + '.other %>' ],
            dest: 'dist/'
          }
        ]
      };

      return this;
    },

    registerTasks: function() {
      gruntCommon.registerTasks();

      grunt.loadNpmTasks('grunt-html2js');
      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-ngmin');
      grunt.loadNpmTasks('grunt-contrib-uglify');
      grunt.loadNpmTasks('grunt-contrib-cssmin');

      grunt.registerTask('vendor', [ 'clean:vendor', 'copy:vendor' ]);

      _.forEach(areas, function(area) {
        grunt.registerTask(area, [ 'clean:' + area, 'html2js:' + area, 'ngmin:' + area, 'uglify:' + area, 'cssmin:' + area, 'copy:' + area ]);
      });

      var buildTasks = [ 'clean:tmp', 'vendor', /* areas */ 'ejs', 'clean:postBuild', 'test' ];
      var args = [2, 0].concat(areas);
      Array.prototype.splice.apply(buildTasks, args);

      grunt.registerTask('build', buildTasks);
      grunt.registerTask('default', 'build');
    },

    getConfig: function() {
      var commonConfig = gruntCommon.getConfig();
      return _.merge({}, commonConfig, gruntConfig);
    },

    initConfig: function() {
      this.registerTasks();
      var config = this.getConfig();

      grunt.log.writeln('Applying grunt configuration ...');
      grunt.initConfig(config);
    }
  };
};