angular.module('blockUI').factory('blockUI', function(blockUIConfig, $timeout) {

  function BlockUI(id) {

    var self = this;

    var state = {
      id: id,
      blockCount: 0,
      message: blockUIConfig.message,
      blocking: false
    }, startPromise, doneCallbacks = [];

    this.start = function(message) {
      state.message = message || blockUIConfig.message;

      state.blockCount++;

      if (!startPromise) {
        startPromise = $timeout(function() {
          startPromise = null;
          state.blocking = true;
        }, blockUIConfig.delay);
      }
    };

    this._cancelStartTimeout = function() {
      if (startPromise) {
        $timeout.cancel(startPromise);
        startPromise = null;
      }
    };

    this.stop = function() {
      state.blockCount = Math.max(0, --state.blockCount);

      if (state.blockCount === 0) {
        this.reset(true);
      }
    };

    this.message = function(value) {
      state.message = value;
    };

    this.pattern = function(regexp) {
      if (regexp !== undefined) {
        self._pattern = regexp;
      }

      return self._pattern;
    };

    this.reset = function(executeCallbacks) {
      self._cancelStartTimeout();
      state.blockCount = 0;
      state.blocking = false;

      try {
        if (executeCallbacks) {
          angular.forEach(doneCallbacks, function(cb) {
            cb();
          });
        }
      } finally {
        doneCallbacks.length = 0;
      }
    };

    this.done = function(fn) {
      doneCallbacks.push(fn);
    };

    this.state = function() {
      return state;
    };
  }

  var bodyBlock = new BlockUI('main');

  var instances = bodyBlock.instances = [];

  instances.main = bodyBlock;

  instances.add = function(id) {
    instances[id] = new BlockUI(id);
    instances.push(instances[id]);
    return instances[id];
  };

  instances.remove = function(idOrInstance) {
    if (angular.isString(idOrInstance)) {
      idOrInstance = instances[idOrInstance];
    }

    if (idOrInstance) {
      idOrInstance.reset();
      delete instances[idOrInstance.state().id];
      var i = instances.length;
      while(--i) {
        if(instances[i] === idOrInstance) {
          instances.splice(i, 1);
          break;
        }
      }
    }
  };
  
  instances.locate = function(request) {
    var i = instances.length;

    while(--i) {
      var instance = instances[i];
      var pattern = instance.pattern();

      if(pattern && pattern.test(request.url)) {
        return instance;
      }
    }

    return bodyBlock;
  };

  return bodyBlock;
});
