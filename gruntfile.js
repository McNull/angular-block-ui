var fs = require('fs');

module.exports = function(grunt) {

  var target = grunt.option('target') || 'debug';
  var gruntTarget = require('./grunt/grunt-' + target)(grunt);

  gruntTarget.addArea('angularBlockUI', 'angular-block-ui')
             .addArea('angularShowdown', 'angular-showdown')
             .addArea('angularDelay', 'angular-delay')
             .addArea('app')
             .registerTasks();

  var config = gruntTarget.getConfig();

  grunt.task.registerTask('postBuild', 'Executed after build.', function() {
    var readme = fs.readFileSync('README.md');
    var license = fs.readFileSync('LICENSE');

    fs.writeFileSync('dist/app/README.md', readme);
    fs.writeFileSync('dist/angular-block-ui/README.md', readme);
    fs.writeFileSync('dist/angular-block-ui/LICENSE', license);
  });

  grunt.initConfig(config);
};
