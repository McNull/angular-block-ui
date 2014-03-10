var _ = require('lodash');

module.exports = function (grunt) {

  var gruntCommon = require('./grunt-common')(grunt);

  var gruntConfig = {
    copy: {
      vendor: {
        src: [
          '<%= files.vendor.js %>',
          '<%= files.vendor.css %>',
          '<%= files.vendor.other %>'
        ],
        dest: 'dist/'
      }
    },
    html2js: {},
    concat: {}
  };

  var projectFiles = gruntCommon.getProjectFiles();

  var areas = [];

  return {
    addArea: function(taskname, areaname) {

      areaname = areaname || taskname;

      gruntCommon.addArea(taskname, areaname);

      areas.push(taskname);

      gruntConfig.html2js[taskname] = {
        src: ['src/' + areaname + '/**/*.tmpl.html'],
        dest: 'dist/' + areaname + '/templates-' + areaname + '.js'
      };

      gruntConfig.copy[taskname] = {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: [
              '<%= files.' + taskname + '.js %>',
              '<%= files.' + taskname + '.css %>',
              '<%= files.' + taskname + '.other %>',
              '!<%= files.' + taskname + '.test %>'
            ],
            dest: 'dist/'
          }
        ]
      };

      ///////////////////////////////////////
      // Package tasks

      var areaJsGlobs = projectFiles[taskname].js;

      gruntConfig.concat[taskname + 'Js'] = {
        src: gruntCommon.expandGlobs(areaJsGlobs, 'src').concat(['<%= html2js.' + taskname + '.dest %>']),
        dest: 'package/' + areaname + '/' + areaname + '.js'
      };

      var areaCssGlobs = projectFiles[taskname].css;

      gruntConfig.concat[taskname + 'Css'] = {
        src: gruntCommon.expandGlobs(areaCssGlobs, 'src'),
        dest: 'package/' + areaname + '/' + areaname + '.css'
      };

      grunt.registerTask('package:' + taskname, ['build', 'test-single', 'concat:' + taskname + 'Css', 'concat:' + taskname + 'Js']);

      ///////////////////////////////////////
      
      return this;
    },
    registerTasks: function() {

      gruntCommon.registerTasks();

      grunt.loadNpmTasks('grunt-contrib-copy');
      grunt.loadNpmTasks('grunt-contrib-concat');
      grunt.loadNpmTasks('grunt-html2js');

      grunt.registerTask('vendor', [ 'clean:vendor', 'copy:vendor' ]);

      _.forEach(areas, function(area) {
        grunt.registerTask(area, [ 'clean:' + area, 'html2js:' + area, 'copy:' + area ]);
      });

      var buildTasks = [ 'vendor', 'ejs', 'clean:postBuild' ];
      var args = [1, 0].concat(areas);
      Array.prototype.splice.apply(buildTasks, args);

      buildTasks.push('postBuild');
      
      grunt.registerTask('build', buildTasks);
      grunt.registerTask('default', 'build');

      return this;
    },
    getConfig: function() {
      var commonConfig = gruntCommon.getConfig();
      var result  = _.merge({}, commonConfig, gruntConfig);

      return result;
    },
    initConfig: function() {
      this.registerTasks();
      var config = this.getConfig();

      grunt.log.writeln('Applying grunt configuration ...');
      grunt.initConfig(config);
    }
  };
};