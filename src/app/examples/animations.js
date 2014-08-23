angular.module('myApp').controller('AnimationController', function($scope, $timeout, blockUI) {

  $scope.startBlock = function(id, timeout) {

    var blockInstance = blockUI.instances.get(id);

    blockInstance.start();

    if(timeout >= 0) {
      $timeout(function() {
        blockInstance.stop();
      }, timeout);
    }
  };

  $scope.stopBlock = function(id) {
    var blockInstance = blockUI.instances.get(id);
    blockInstance.stop();
  };

  $scope.toggleBlock = function(id) {
    var blockInstance = blockUI.instances.get(id);

    if(blockInstance.state().blocking) {
      blockInstance.stop();
    } else {
      blockInstance.start();
    }
  };

});