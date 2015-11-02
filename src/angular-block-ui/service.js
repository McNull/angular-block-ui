blkUI.factory('blockUI', function(blockUIConfig, $timeout, blockUIUtils, $document) {

  var $body = $document.find('body');
  
  // These properties are not allowed to be specified in the start method.
  var reservedStateProperties = ['id', 'blockCount', 'blocking'];
  
  function BlockUI(id) {

    var self = this;

    var state = {
      id: id,
      blockCount: 0,
      message: blockUIConfig.message,
      blocking: false
    }, startPromise, doneCallbacks = [];

    this._id = id;

    this._refs = 0;

    this.start = function(messageOrOptions) {
      
      messageOrOptions = messageOrOptions || {};
      
      if(angular.isString(messageOrOptions)) {
        messageOrOptions = {
          message: messageOrOptions
        };
      } else {
        angular.forEach(reservedStateProperties, function(x) {
          if(messageOrOptions[x]) {
            throw new Error('The property ' + x + ' is reserved for the block state.');
          }
        });
      } 
      
      angular.extend(state, messageOrOptions);
      
      if(state.blockCount > 0) {
        state.message = messageOrOptions.message || state.message || blockUIConfig.message;
      } else {
        state.message = messageOrOptions.message || blockUIConfig.message;
      }
      
      // if(state.blockCount > 0) {
      //   messageOrOptions = messageOrOptions || state.message || blockUIConfig.message;
      // } else {
      //   messageOrOptions = messageOrOptions || blockUIConfig.message;
      // }

      // state.message = messageOrOptions;

      state.blockCount++;

      // Check if the focused element is part of the block scope

      var $ae = angular.element($document[0].activeElement);

      if($ae.length && blockUIUtils.isElementInBlockScope($ae, self)) {

        // Let the active element lose focus and store a reference 
        // to restore focus when we're done (reset)

        self._restoreFocus = $ae[0];

        // https://github.com/McNull/angular-block-ui/issues/13
        // http://stackoverflow.com/questions/22698058/apply-already-in-progress-error-when-using-typeahead-plugin-found-to-be-relate
        // Queue the blur after any ng-blur expression.

        $timeout(function() {
          // Ensure we still need to blur
          // Don't restore if active element is body, since this causes IE to switch windows (see http://tjvantoll.com/2013/08/30/bugs-with-document-activeelement-in-internet-explorer/)
          if (self._restoreFocus && self._restoreFocus !== $body[0]) {
            self._restoreFocus.blur();
          }
        });
      }

      if (!startPromise && blockUIConfig.delay !== 0) {
        startPromise = $timeout(block, blockUIConfig.delay);
      } else if (blockUIConfig.delay === 0) {
        block();
      }

      function block () {
        startPromise = null;
        state.blocking = true;
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
        self.reset(true);
      }
    };

    this.isBlocking = function () {
        return state.blocking;
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

      // Restore the focus to the element that was active
      // before the block start, but not if the user has 
      // focused something else while the block was active.

      if(self._restoreFocus && 
         (!$document[0].activeElement || $document[0].activeElement === $body[0])) {
        
        //IE8 will throw if element for setting focus is invisible
        try {
          self._restoreFocus.focus();
        } catch(e1) {
          (function () {
              var elementToFocus = self._restoreFocus;
              $timeout(function() { 
                if(elementToFocus) { 
                  try { 
                    elementToFocus.focus(); 
                  } catch(e2) { }
              } 
            },100);
          })();
        }
        
        self._restoreFocus = null;
      }
      
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

    if(!isNaN(id)) {
      throw new Error('BlockUI id cannot be a number');
    }

    var instance = instances[id];

    if(!instance) {
      // TODO: ensure no array instance trashing [xxx] -- current workaround: '_' + $scope.$id
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

      var i = blockUIUtils.indexOf(instances, idOrInstance);
      instances.splice(i, 1);

      delete instances[idOrInstance.state().id];
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
