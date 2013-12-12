angular.module('myApp').constant('documentationRoutes', {
  '/documentation': {
      templateUrl: 'app/documentation/documentation.tmpl.html',
      controller: 'DocumentationController'
    }
});

angular.module('myApp').controller('DocumentationController', function($scope, blockUI, $timeout) {

  $scope.startBlock = function() {
    blockUI.start();

    $timeout(function() {
      blockUI.stop();
    }, 1000);
  };

  $scope.startBlockMessage = function() {
    blockUI.start("A custom message ...");

    $timeout(function() {
      blockUI.message('... another custom message ...');
    }, 1000);

    $timeout(function() {
      blockUI.message('... and another ...');
    }, 2000);

    $timeout(function() {
      blockUI.message('... and the last custom message ...');
    }, 3000);

    $timeout(function() {
      blockUI.stop();
    }, 4000);
  };

});