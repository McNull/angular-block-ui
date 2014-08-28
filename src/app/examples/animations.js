angular.module('myApp').controller('AnimationController', function($scope, $timeout, blockUI) {

  $scope.toggleMyBlock = function() {
    $scope.state = $scope.state || {};

    if($scope.state.myBlockActive) {

//      if($scope.state.promise) {
//        $timeout.cancel($scope.state.promise);
//        delete $scope.state.promise;
//      }

      if($scope.state.myBlockVisible) {
        $scope.state.myBlockActive = false;
        $scope.state.myBlockVisible = false;
      } else {
        $scope.state.myBlockVisible = true;
      }


    } else {
      $scope.state.myBlockActive = true;

//      $scope.state.promise = $timeout(function() {
//        $scope.state.myBlockVisible = true;
//        delete $scope.state.promise;
//      }, 200);
    }
  };

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