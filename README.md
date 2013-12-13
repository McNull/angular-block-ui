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

## Service methods

### start
The start method will start the user interface block. Because multiple user interface elements can request a user interface block at the same time, the service keeps track of the number of start calls. Each call to start() will increase the count and every call to stop() will decrease the value. Whenever the count reaches 0 the block will end.

#### Arguments

##### message (string)
Indicates the message to be shown in the overlay. If none is provided, the default message from the configuration is used.

### stop
This will decrease the block count. The block will end if the count is 0.

### reset
The reset will force a unblock by setting the block count to 0.

### message
Allows the message shown in the overlay to be updated while to block is active.