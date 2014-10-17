
var myApp = angular.module('myApp', ['blockUI']);

myApp.config(function(blockUIConfig) {
  // Tell blockUI not to mark the body element as the main block scope.
  blockUIConfig.autoInjectBodyBlock = false;  
});

myApp.controller('MyController', function($scope, blockUI, $timeout) {
  
  $scope.startBlock = function() {
    
    blockUI.start();
    
    $timeout(function() {
      blockUI.stop();
    }, 2000);
  };
  
});