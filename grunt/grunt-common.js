var _ = require('lodash');

module.exports = function(grunt) {

  var target = grunt.option('target') || 'debug';
  var areas = [];
  var projectFiles = require('./project-files-' + target);

  grunt.log.writeln('Target set to: "' + target + '". Specify with --target=(debug/release).');

  return {
    addArea: function(taskname, areaname) {
      areaname = areaname || taskname;
      grunt.log.writeln('Adding area ' + areaname + ' [task: ' + taskname + '] ...');
      areas.push({
        taskname: taskname,
        areaname: areaname
      });
      projectFiles.addArea(taskname, areaname);
    },
    registerTasks: function() {
      grunt.log.writeln('Registering tasks ...');
      grunt.loadNpmTasks('grunt-contrib-clean');
      grunt.loadNpmTasks('grunt-ejs-render');
      grunt.loadNpmTasks('grunt-karma');
      grunt.registerTask('ejs', ['clean:render', 'render:index', 'render:karmaConf']);
      grunt.registerTask('test-single', ['render:karmaConf', 'karma:single']);
      grunt.registerTask('test', ['build', 'render:karmaConf', 'karma:unit']);
    },
    expandGlobs: function(globs, cwd) {
      
      // Workaround for the concat grunt task in combination with cwd.

      // Shama made me do this :(
      // https://github.com/gruntjs/grunt-contrib-concat/issues/31

      var result = grunt.file.expand({
        cwd: cwd
      }, globs).map(function(glob) {
        return cwd + '/' + glob;
      });

      return result;
    },
    getProjectFiles: function() {
      return projectFiles;
    },
    getConfig: function() {

      grunt.log.writeln('Building configuration ...');

      function getIncludes(ext, sections, cwd, prefix) {

        var areaTasknames = _.pluck(areas, 'taskname');

        var sectionsDefaults = {
          vendor: ['vendor'],
          vendorAreas: ['vendor'].concat(areaTasknames),
          areas: areaTasknames
        };

        sections = sections || 'vendorAreas';

        if (_.isString(sections)) {
          sections = sectionsDefaults[sections];
        }

        if (!_.isArray(sections)) {
          throw Error('Argument sections should either be an explicit array of section names or one of the following string values: "vendor", "vendorAreas" or "areas"');
        }

        cwd = cwd || 'dist';

        if (prefix) {
          if (_.isBoolean(prefix)) {
            prefix = cwd;
          }

          if (prefix[prefix.length - 1] !== '/') prefix += '/';
        }

        var globs = [];

        _.forEach(sections, function(section) {
          globs = globs.concat(projectFiles[section][ext]);
        });

        var results = grunt.file.expand({
          cwd: cwd
        }, globs);

        if (prefix) {
          results = _.map(results, function(val) {
            return prefix + val;
          });
        }

        return results;
      }

      var gruntConfig = {
        files: projectFiles,
        clean: {
          render: ['dist/index.html', 'karma/karma.conf.js'],
          tmp: ['tmp'],
          vendor: ['dist/vendor'],
          postBuild: {
            src: ['dist/**/*'],
            filter: function(filepath) {
              // Removes only empty folders
              return grunt.file.isDir(filepath) && fs.readdirSync(filepath).length === 0;
            }
          }
        },
        render: {
          index: {
            options: {
              helpers: {
                getIncludes: getIncludes,
                target: target
              }
            },
            files: {
              'dist/index.html': ['src/index.ejs']
            }
          },
          karmaConf: {
            options: {
              helpers: {
                getIncludes: getIncludes,
                target: target
              }
            },
            files: {
              'karma/karma.conf.js': ['karma/karma.conf.ejs']
            }
          }
        },
        karma: {
          unit: {
            configFile: 'karma/karma.conf.js'
          },
          single: {
            singleRun: true,
            configFile: 'karma/karma.conf.js'
          },
        }
      };

      _.forEach(areas, function(area) {
        gruntConfig.clean[area.taskname] = ['dist/' + area.areaname];
      });

      return gruntConfig;
    }
  };
};
