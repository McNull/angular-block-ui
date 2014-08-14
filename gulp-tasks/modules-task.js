var path = require('path');
var through = require('through2');
var config = require('../build-config.js');

module.exports = function (gulp) {

  var moduleTasks = [];

  for (var i = 0; i < config.modules.length; i++) (function (module) {

    moduleTasks.push(module.name);

    module.folders = {
      src: path.join(config.folders.src, module.name),
      dest: path.join(config.folders.dest, module.name)
    };

    // We'll track the tasks that are created for this module so that we can one gulp task that is dependent on this list.

    module.tasks = [];
    module.task = moduleTask;

    // Filenames of every file we'll process in some way is kept in this array. Everything not touched is copied to the
    // destination directory at the end (copy-task).

    module.touched = [];
    module.touch = moduleTouchFile;

    // Register all tasks for the current module.

    require('./module-tasks/clean-task.js')(gulp, module);
    require('./module-tasks/styles-task.js')(gulp, module);
    require('./module-tasks/templates-task.js')(gulp, module);
    require('./module-tasks/scripts-task.js')(gulp, module);
    require('./module-tasks/svg-task.js')(gulp, module);
    require('./module-tasks/copy-task.js')(gulp, module);

    // Register a task for this module that is dependent on all sub tasks.

    gulp.task(module.name, module.tasks);

  })(config.modules[i]);

  // Register the main task that is dependent on all module tasks

  gulp.task('modules', moduleTasks);

  // - - - - - - - 8-< - - - - - - - - - - - - - - - - - - - -

  function moduleTask(taskname, depsOrFn, fn) {

    var module = this;

    if (typeof(depsOrFn) == 'string') {
      depsOrFn = [depsOrFn];
    }

    if (Array.isArray(depsOrFn)) {

      var map = [];

      depsOrFn.forEach(function (dep) {
        map.push(module.name + '-' + dep);
      });

      depsOrFn = map;

    }

    var fulltaskname = module.name + '-' + taskname;
    gulp.task(fulltaskname, depsOrFn, fn);
    module.tasks.push(fulltaskname);

  }

  // - - - - - - - 8-< - - - - - - - - - - - - - - - - - - - -

  function moduleTouchFile() {

    var module = this;

    return through.obj(function (file, enc, callback) {
      module.touched.push(file.path);
      this.push(file);
      return callback();
    });

  }

  // - - - - - - - 8-< - - - - - - - - - - - - - - - - - - - -
};

