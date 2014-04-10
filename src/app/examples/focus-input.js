angular.module('myApp').controller('FocusInputExampleController', function($scope, blockUI, $timeout) {

  var loginFormBlock = blockUI.instances.get('loginFormBlock');

  $scope.login = function() {
    loginFormBlock.start('Validating account ...');

    $timeout(function() {
      loginFormBlock.stop();
    }, 2000);
  };

  var searchFormBlock = blockUI.instances.get('searchFormBlock');

  $scope.search = function() {
    searchFormBlock.start('Searching ...');

    $timeout(function() {
      searchFormBlock.stop();
    }, 2000);
  };  

  $scope.globalBlock = function() {

    blockUI.start('Blocking whole page ...');

    $timeout(function() {
      blockUI.stop();
    }, 2000);

  };
});