(function(angular) {
  var m = angular.module('blockUI', ['templates-angularBlockUI']);

  m.factory('blockUI', function($document, $templateCache, $rootScope, $compile, $timeout) {

    var $overlay, $scope, defaultMessage = "Loading ...", delay = 500, startPromise;

    initScope();
    initOverlay();

    function initScope() {
      $scope = $rootScope.$new();
      $scope.blockCount = 0;

      $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        if ($scope.blockCount > 0) {
          event.preventDefault();
        } else {
          start();
        }
      });

      $scope.$on('$locationChanged', function() {
        stop();
      });
    }

    function initOverlay() {
      var $body = $document.find('body');
      var template = $templateCache.get('angular-block-ui/angular-block-ui.tmpl.html');
      var $overlay = angular.element(template);

      $compile($overlay)($scope);

      $body.append($overlay);
    }

    function start(message) {
      $scope.message = message || defaultMessage;

      $scope.blockCount++;

      if(!startPromise) {
        startPromise = $timeout(function() {
          startPromise = null;
          $scope.blocking = true;
        }, delay);
      }
    }

    function stop() {

      if(startPromise) {
        $timeout.cancel(startPromise);
        startPromise = null;
      }

      $scope.blockCount = Math.max(0, --$scope.blockCount);

      if($scope.blockCount === 0) {
        $scope.blocking = false;
      }
    }

    function message(message) {
      $scope.message = message;
    }

    function reset() {
      $scope.blockCount = 0;
    }

    return {
      start: start,
      stop: stop,
      message: message,
      reset: reset
    };
  });

})(angular);
