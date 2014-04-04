
angular.module('myApp').controller('ManualBlockingController', function($scope, blockUI, $timeout, $http, $window) {

  $scope.startBlock = function() {
    blockUI.start();

    $timeout(function() {
      blockUI.stop();
    }, 2000);
  };

  $scope.startBlockWithMessage = function() {
    blockUI.start("My custom message");

    $timeout(function() {
      blockUI.stop();
    }, 2000);
  };

  $scope.startBlockUpdateMessage = function() {
    blockUI.start();

    $timeout(function() {
      blockUI.message('Still loading ...');
    }, 1000);

    $timeout(function() {
      blockUI.message('Almost there ...');
    }, 2000);

    $timeout(function() {
      blockUI.message('Cleaning up ...');
    }, 3000);

    $timeout(function() {
      blockUI.stop();
    }, 4000);
  };

  $scope.resetOnError = function() {
    blockUI.start();

    $timeout(function() {
      throw new Error('Oh dear!');
      blockUI.stop(); // Stop will never be called
    }, 1000);

  };

  $scope.withHttpRequest = function() {

    $http.get('/api/quote/').then(function(data) {
      console.log(data);
    });
  };

  $scope.executeWhenDone = function() {

    blockUI.start();

    blockUI.done(function() {
      $window.alert('BlockUI has finished.');
    });

    $timeout(function() {
      blockUI.stop();
    }, 1000);
  };
});