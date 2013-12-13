angular-block-ui
============
A simple AngularJS module that allows you to block user interaction on AJAX requests. 

# Dependencies
Besides AngularJS (~1.2.4), none.  

# Usage
The blockUI module exposes a service by the same name. Access to the service is gained by injecting it into your controller or directive:

    angular.module('myApp').controller('MyController', function($scope, blockUI) {
      // A function called from user interface, which performs an async operation.
      $scope.onSave = function(item) {
    
        // Block the user interface
        blockUI.start();

        // Perform the async operation    
        item.$save(function() {
      
        // Unblock the user interface
        blockUI.stop();
      });
     };
    });
