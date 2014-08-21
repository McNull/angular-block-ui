angular.module('myApp').controller('AnimationController', function($scope, $timeout, blockUI) {

  $scope.startBlock = function(id, timeout) {

    var blockInstance = blockUI.instances.get(id);

    blockInstance.start();

    $timeout(function() {

      //blockInstance.stop();

    }, timeout);

  };
});