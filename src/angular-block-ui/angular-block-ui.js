(function(angular) {
  angular.module('blockUI', ['templates-angularBlockUI']);

  angular.module('blockUI').config(function($provide, $httpProvider) {

    var _config = {
      templateUrl: 'angular-block-ui/angular-block-ui.tmpl.html',
      delay: 250,
      message: "Loading ...",
      autoBlock: true,
      resetOnException: true,
      requestFilter: angular.noop
    };

    $provide.provider('blockUIConfig', function() {

      this.templateUrl = function(url) {
        _config.templateUrl = url;
      };

      this.template = function(template) {
        _config.template = template;
      };

      this.delay = function(delay) {
        _config.delay = delay;
      };

      this.message = function(message) {
        _config.message = message;
      };

      this.autoBlock = function(enabled) {
        _config.autoBlock = enabled;
      };

      this.resetOnException = function(enabled) {
        _config.resetOnException = enabled;
      };

      this.requestFilter = function(filter) {
        _config.requestFilter = filter;
      };

      this.$get = function() {
        return _config;
      };
      
    }); // blockUIConfig

    $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
      function($delegate, $injector) {
        var blockUI;

        return function(exception, cause) {
          if (_config.resetOnException) {
            blockUI = blockUI || $injector.get('blockUI');
            blockUI.reset();
          }

          $delegate(exception, cause);
        };
      }
    ]);

    $provide.factory('blockUIHttpInterceptor', ['$q', '$injector',
      function($q, $injector) {

        var blockUI;

        function injectBlockUI() {
          blockUI = blockUI || $injector.get('blockUI');
        }

        function error(rejection) {
          if (_config.autoBlock) {
            injectBlockUI();
            blockUI.stop();
          }

          return $q.reject(rejection);
        }

        return {
          request: function(config) {

            
            if (_config.autoBlock) {

              // Don't block excluded requests

              if(_config.requestFilter(config) === false) {
                // Tag the config so we don't unblock this request
                config.$_noBlock = true;
              } else {
                injectBlockUI();
                blockUI.start();  
              }
            }

            return config;
          },

          requestError: error,

          response: function(response) {

            // Check if the response is tagged to ignore

            if (_config.autoBlock && !response.config.$_noBlock) {
              injectBlockUI();
              blockUI.stop();
            }

            return response;
          },

          responseError: error
        };

      }
    ]);

    $httpProvider.interceptors.push('blockUIHttpInterceptor');
  });

  angular.module('blockUI').directive('blockUi', function(blockUI, blockUIConfig) {

    return {
      restrict: 'A',
      templateUrl: blockUIConfig.template ? undefined : blockUIConfig.templateUrl,
      template: blockUIConfig.template,
      link: function($scope, $element, $attrs) {
        $scope.state = blockUI.state();

        var fn = $scope.$on('$viewContentLoaded', function($event) {
          fn();
          $scope.$on('$locationChangeStart', function(event) {
            if ($scope.state.blockCount > 0) {
              event.preventDefault();
            }
          });          
        });
      }
    };

  });

  angular.module('blockUI').factory('blockUI', function(blockUIConfig, $timeout) {

    var state = { 
      blockCount: 0, 
      message: blockUIConfig.message,
      blocking: false
    }, startPromise, stopPromise, doneCallbacks = [];

    function start(message) {
      state.message = message || blockUIConfig.message;

      state.blockCount++;

      if (!startPromise) {
        startPromise = $timeout(function() {
          startPromise = null;
          state.blocking = true;
        }, blockUIConfig.delay);
      }
    }

    function cancelStartTimeout() {
      if (startPromise) {
        $timeout.cancel(startPromise);
        startPromise = null;
      }
    }

    function stop() {
      state.blockCount = Math.max(0, --state.blockCount);

      if (state.blockCount === 0) {
        reset(true);
      }
    }

    function message(message) {
      state.message = message;
    }

    function reset(executeCallbacks) {
      cancelStartTimeout();
      state.blockCount = 0;
      state.blocking = false;

      try {
        if(executeCallbacks) {
          angular.forEach(doneCallbacks, function(cb) { cb(); });
        }
      } finally {
        doneCallbacks.length = 0;
      }
    }

    function done(fn) {
      doneCallbacks.push(fn);
    }

    return {
      state: function() { return state; },
      start: start,
      stop: stop,
      message: message,
      reset: reset,
      done: done
    };
  });
  
  angular.module('blockUI').run(function($document) {
    $document.find('body').append('<div block-ui></div>');
  });

})(angular);
