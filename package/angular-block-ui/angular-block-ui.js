/* Copyright (c) 2013-2014, Null McNull https://github.com/McNull, LICENSE: MIT */
(function(angular) {
  angular.module('blockUI', ['templates-angularBlockUI']);

  angular.module('blockUI').config(function($provide, $httpProvider) {

    var _config = {
      templateUrl: 'angular-block-ui/angular-block-ui.tmpl.html',
      delay: 250,
      message: "Loading ...",
      autoBlock: true,
      resetOnException: true
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
              injectBlockUI();
              blockUI.start();
            }

            return config;
          },

          requestError: error,

          response: function(response) {
            if (_config.autoBlock) {
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

angular.module('templates-angularBlockUI', ['angular-block-ui/angular-block-ui.tmpl.html']);

angular.module("angular-block-ui/angular-block-ui.tmpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("angular-block-ui/angular-block-ui.tmpl.html",
    "<div ng-show=\"state.blockCount > 0\" class=\"block-ui-overlay\" ng-class=\"{ 'block-ui-visible': state.blocking }\"></div>\n" +
    "<div ng-show=\"state.blocking\" class=\"block-ui-message-container\">\n" +
    "  <div class=\"block-ui-message\">{{ state.message }}</div>  \n" +
    "</div>\n" +
    "");
}]);
