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

      this.$get = ['$templateCache',
        function($templateCache) {

          if (!_config.template) {
            _config.template = $templateCache.get(_config.templateUrl);
          }

          return _config;
        }
      ];

    }); // blockUIConfig

    $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
      function($delegate, $injector) {
        return function(exception, cause) {

          if (_config.resetOnException) {
            var blockUI = $injector.get('blockUI');

            if (blockUI) {
              blockUI.reset();
            }
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


  angular.module('blockUI').factory('blockUI', function(blockUIConfig, $document, $rootScope, $timeout, $compile) {

    var $overlay, $scope, startPromise, stopPromise;

    initScope();
    initOverlay();

    function initScope() {
      $scope = $rootScope.$new();
      $scope.blockCount = 0;

      $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        if ($scope.blockCount > 0) {
          event.preventDefault();
        }
      });
    }

    function initOverlay() {
      var $body = $document.find('body');
      var $overlay = angular.element(blockUIConfig.template);

      $compile($overlay)($scope);

      $body.append($overlay);
    }

    function start(message) {
      $scope.message = message || blockUIConfig.message;

      $scope.blockCount++;

      if (!startPromise) {
        startPromise = $timeout(function() {
          startPromise = null;
          $scope.blocking = true;
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
      $scope.blockCount = Math.max(0, --$scope.blockCount);

      if ($scope.blockCount === 0) {
        cancelStartTimeout();
        $scope.blocking = false;
      }
    }

    function message(message) {
      $scope.message = message;
    }

    function reset() {
      cancelStartTimeout();
      $scope.blockCount = 0;
      $scope.blocking = false;
    }

    return {
      start: start,
      stop: stop,
      message: message,
      reset: reset
    };
  });

  // By forcing the injection of the blockUI service we ensure that it's initialized at application start.
  angular.module('blockUI').run(function(blockUI) {});

})(angular);
