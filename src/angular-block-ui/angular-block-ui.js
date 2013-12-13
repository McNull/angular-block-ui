(function(angular) {
  angular.module('blockUI', ['templates-angularBlockUI']);

  angular.module('blockUI').config(function($provide) {

    var config = {
      templateUrl: 'angular-block-ui/angular-block-ui.tmpl.html',
      delay: 0,
      message: "Loading ...",
      onLocationChange: true,
      resetOnException: true
    };

    $provide.provider('blockUIConfig', function() {

      this.templateUrl = function(url) {
        config.templateUrl = url;
      };

      this.template = function(template) {
        config.template = template;
      };

      this.delay = function(delay) {
        config.delay = delay;
      };

      this.message = function(message) {
        config.message = message;
      };

      this.onLocationChange = function(enabled) {
        config.onLocationChange = enabled;
      };

      this.resetOnException = function(enabled) {
        config.resetOnException = enabled;
      };

      this.$get = ['$templateCache',
        function($templateCache) {

          if (!config.template) {
            config.template = $templateCache.get(config.templateUrl);
          }

          return config;
        }
      ];

    }); // blockUIConfig

    $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
      function($delegate, $injector) {
        return function(exception, cause) {

          if(config.resetOnException) {
            var blockUI = $injector.get('blockUI');

            if(blockUI) {
              blockUI.reset();
            }
          }

          $delegate(exception, cause);
        };
      }
    ]);

  });

  // By forcing the injection of the blockUI service we ensure that it's initialized at application start.
  angular.module('blockUI').run(function(blockUI) {});

  angular.module('blockUI').factory('blockUI', function(blockUIConfig, $document, $templateCache, $rootScope, $compile, $timeout) {

    var $overlay, $scope, startPromise;

    initScope();
    initOverlay();

    function initScope() {
      $scope = $rootScope.$new();
      $scope.blockCount = 0;

      $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        if ($scope.blockCount > 0) {
          event.preventDefault();
        } else if (blockUIConfig.onLocationChange) {
          start();
        }
      });

      $scope.$on('$locationChangeSuccess', function() {
        if (blockUIConfig.onLocationChange) {
          stop();
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

    function cancelTimeout() {
      if (startPromise) {
        $timeout.cancel(startPromise);
        startPromise = null;
      }
    }

    function stop() {

      cancelTimeout();
      
      $scope.blockCount = Math.max(0, --$scope.blockCount);

      if ($scope.blockCount === 0) {
        $scope.blocking = false;
      }
    }

    function message(message) {
      $scope.message = message;
    }

    function reset() {
      cancelTimeout();
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

})(angular);
