var app = angular.module('myApp', ['blockUI']);

app.config(function(blockUIConfig) {
  
  // Enable navigation block
  
  blockUIConfig.blockBrowserNavigation = true;
  
});

app.controller('MainCtrl', function ($scope, blockUIConfig, blockUI, $timeout, $location) {
  
  $scope.blockUIConfig = blockUIConfig;  
  $scope.indexItems = [];
  
  // Create some url history entries in the browser
  
  var indexCount = 10;
  
  for (var i = 0; i < indexCount; i++) {
    $scope.indexItems.push(i);
    (function (i) {
      $timeout(function () {
        $location.search({
          index: i
        });
      }, indexCount - i);
    })(i);
  }

  $scope.$watch(function() {
    return $location.search().index;  
  }, function(value) {
    $scope.index = value || 0;
  });
  
  $scope.startBlock = function (changeLocation) {

    var duration = 5000,
      step = 100;

    function message(t) {
      return "Blocking (" + t + " ms)";
    }

    function tick(t) {
      if (t > 0) {
        if(changeLocation) {
          var index = Math.floor(Math.random() * $scope.indexItems.length);
          $location.search({ index: index })
        }
        
        blockUI.message(message(t));
        $timeout(function () {
          tick(t - step);
        }, step);
      } else {
        blockUI.stop();
      }
    }

    blockUI.start();
    tick(duration);
  };
});