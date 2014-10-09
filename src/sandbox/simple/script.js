angular.module('app', ['blockUI'])
  .config(function(blockUIConfig) {
    // Disable injecting the main block on the body
    blockUIConfig.autoInjectBodyBlock = false;
  })
  .controller('thing', function ($scope, blockUI) {
    $scope.show = function () {
      blockUI.start();
    };
  });