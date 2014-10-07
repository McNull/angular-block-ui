var path = require('path');
var through = require('through2');
var config = require('../build-config.js');

module.exports = function (gulp) {

  var moduleTasks = [];
  var moduleWatchTasks = [];

  for (var i = 0; i < config.modules.length; i++) (function (module) {

    moduleTasks.push(module.name);
    moduleWatchTasks.push(module.name + '-watch');

    module.folders = {
      src: path.join(config.folders.src, module.name),
      dest: path.join(config.folders.dest, module.name)
    };

    // We'll track the tasks that are created for this module so that we can one gulp task that is dependent on this list.

    module.tasks = [];
    module.task = moduleTask;

    // We do the same for the watch tasks.

    module.watchTasks = [];
    module.watch = moduleWatchTask;

    // Filenames of every file we'll process in some way is kept in this array. Everything not touched is copied to the
    // destination directory at the end (copy-task).

    module.touched = [];
    module.touch = moduleTouchFile;

    // Register all tasks for the current module.

    // require('./module-tasks/clean-task.js')(gulp, module);
    require('./module-tasks/styles-task.js')(gulp, module);
    require('./module-tasks/templates-task.js')(gulp, module);
    require('./module-tasks/scripts-task.js')(gulp, module);
    require('./module-tasks/svg-task.js')(gulp, module);
    require('./module-tasks/copy-task.js')(gulp, module);

    // Register a task for this module that is dependent on all sub tasks ...

    gulp.task(module.name, module.tasks);

    // ... and register a watch task for this module

    gulp.task(module.name + '-watch', module.watchTasks);

  })(config.modules[i]);

  // Register the main task that is dependent on all module tasks

  gulp.task('modules', moduleTasks);

  // ... and register a task that is dependent on all the module watch tasks

  gulp.task('modules-watch', moduleWatchTasks);

  // - - - - - - - 8-< - - - - - - - - - - - - - - - - - - - -

  function moduleTask(taskname, depsOrFn, fn, noAutoRegister) {

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

    if(!noAutoRegister) {
      module.tasks.push(fulltaskname);
    }

  }

  // - - - - - - - 8-< - - - - - - - - - - - - - - - - - - - -

  function moduleWatchTask(taskname, fn) {
    var module = this;
    var fulltaskname = module.name + '-' + taskname + '-watch';

    module.task(taskname + '-watch', null, function(cb) {

      var w = fn();

      if(!w) {
        throw new Error('No options returned from watch: ' + taskname);
      }

      if(!w.glob) {
        throw new Error('No glob watch property in options: ' + taskname);
      }

      w.tasks = w.tasks || [taskname];

      var i = w.tasks.length;

      while(i--) {
        w.tasks[i] = module.name + '-' + w.tasks[i];
      }

      var watcher =  gulp.watch(w.glob, w.tasks);

      function onEvent(event) {
        console.log(event);
      }

      watcher.on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        var exec = require('child_process').exec;

        exec('growlnotify --image gulp-tasks/run.png -n angular-project-template -m "' + module.name + '-' + taskname + ': build triggered."')
      });

      cb();
    }, true);

    module.watchTasks.push(fulltaskname);
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

