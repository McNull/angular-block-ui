
angular.module('myApp').controller('ElementBlockingController', function($scope, blockUI) {

  $scope.toggleBlock = function(name) {

    // Get a reference to the blockUI instance
  
    var myBlock = blockUI.instances.get(name);

    if(myBlock.state().blocking) {
      myBlock.stop();
    } else {
      myBlock.start();
    }
  };

});

