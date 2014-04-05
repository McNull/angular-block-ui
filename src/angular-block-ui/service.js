angular.module('blockUI').factory('blockUI', function(blockUIConfig, $timeout, blockUIUtils) {

  function BlockUI(id) {

    var self = this;

    var state = {
      id: id,
      blockCount: 0,
      message: blockUIConfig.message,
      blocking: false
    }, startPromise, doneCallbacks = [];

    this._refs = 0;

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

    this.addRef = function() {
      self._refs += 1;
    };

    this.release = function() {
      if(--self._refs <= 0) {
        mainBlock.instances._destroy(self);
      }
    };
  }

  var instances = [];

  instances.get = function(id) {
    var instance = instances[id];

    if(!instance) {
      instance = instances[id] = new BlockUI(id);
      instances.push(instance);
    }

    return instance;
  };

  instances._destroy = function(idOrInstance) {
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

    var result = [];

    // Add function wrappers that will be executed on every item
    // in the array.
    
    blockUIUtils.forEachFnHook(result, 'start');
    blockUIUtils.forEachFnHook(result, 'stop');

    var i = instances.length;

    while(i--) {
      var instance = instances[i];
      var pattern = instance._pattern;

      if(pattern && pattern.test(request.url)) {
        result.push(instance);
      }
    }

    if(result.length === 0) {
      result.push(mainBlock);
    }

    return result;
  };

  // Propagate the reset to all instances

  blockUIUtils.forEachFnHook(instances, 'reset');

  var mainBlock = instances.get('main');

  mainBlock.addRef();
  mainBlock.instances = instances;

  return mainBlock;
});
