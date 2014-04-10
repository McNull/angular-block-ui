angular-block-ui
============
An AngularJS module that allows you to block user interaction on AJAX requests. Blocking is done automatically for each http request and/or manually via an injectable service. 

#### Dependencies
Besides AngularJS (~1.2.4), none.  

#### Demos
Live demos can be found on [Plunker](http://plnkr.co/edit/XWRfHX?p=preview) or by executing the website included in the [GitHub project](https://github.com/McNull/angular-block-ui) .

#### Installation
Either copy the contents of the `package` directory of the [Github](https://github.com/McNull/angular-block-ui) project or install with _bower_ from the command line (**recommended**):
    
    bower install angular-block-ui

Include both the JS and CSS file in your html:

    <link rel="stylesheet" href="path-to-block-ui/angular-block-ui.min.css"/>
    <!-- After AngularJS -->
	<script src="path-to-block-ui/angular-block-ui.min.js"></script>
Create a dependency on `blockUI` in your main Angular module:

    angular.module('myApp', ['blockUI'])

#### Usage
By default the module will block the user interface on each pending request made from the browser. This behaviour can be modified in the configuration.
 
It's also possible to do the blocking manually. The blockUI module exposes a service by the same name. Access to the service is gained by injecting it into your controller or directive:

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

BlockUI service methods
=======================

#### start
The start method will start the user interface block. Because multiple user interface elements can request a user interface block at the same time, the service keeps track of the number of start calls. Each call to `start()` will increase the count and every call to `stop()` will decrease the value. Whenever the count reaches 0 the block will end.

*Note: By default the block is immediately active after calling this method, but to prevent trashing the user interface each time a button is pressed, the block is visible after a short delay. This behaviour can be modified in the configuration.*

**Arguments:**

* **message** (string)
Indicates the message to be shown in the overlay. If none is provided, the default message from the configuration is used.

#### stop
This will decrease the block count. The block will end if the count is 0.

#### reset
The reset will force an unblock by setting the block count to 0.

#### message
Allows the message shown in the overlay to be updated while to block is active.

#### done
Queues a callback function to be called when the block has finished. This can be useful whenever you wish to redirect the user to a different location while there are still pending AJAX requests.

**Arguments:**

* **callback** (function)
The callback function to queue.

Blocking individual elements
============================

Instead of blocking the whole page, it's also possible to block individual elements. Just like the main `blockUI` service, this can be done either manually or automatically. Elements can be made _block ui enabled_ by adding a sibling `block-ui` directive element.

```
<div>
  <p> ... I'm blockable ... </p>
  <div block-ui="myBlockUI"></div>
</div>
```

#### Automatic blocking

Automatic blocking elements can be done by providing the `block-ui` directive a `block-ui-pattern` attribute. This attribute should contain a valid regular expression, which indicates the requests that are associated with the specific element.

```
<div>
  <p> ... I'm blockable ... </p>
  <!-- Initiated the block whenever a request to '/api/quote' is performed -->
  <div block-ui block-ui-pattern="/^\/api\/quote($|\/).*/"></div>
</div>
```

#### Manual blocking

By providing the `block-ui` directive a name the controller can request the instance via the injected `blockUI` service. All functions exposed by the main `blockUI` service are available on the individual instances.
 
```
<div>
  <p> ... I'm blockable ... </p>
  <div block-ui="myBlockUI"></div>
</div>
```
```
angular.module('myApp').controller('MyController', function($scope, $http, blockUI) {

  // Grab the reference to the instance defined in the html markup
  var myBlockUI = blockUI.instances.get('myBlockUI');
  
  $scope.doSomethingAsync = function() {
  	
    myBlockUI.start();
    	
    $timeout(function() {
	  myBlockUI.stop(); 
	}, 1000);  
	
  };
});
```


BlockUI overlay template
========================

The html and styling of the builtin template is kept bare bone. It consist of two divs (overlay and message):

    <div ng-show="blockCount > 0" class="block-ui-overlay" ng-class="{ 'block-ui-visible': blocking }"></div>
    <div ng-show="blocking" class="block-ui-message">{{ message }}</div>

A custom template can be specified in the module configuration.

BlockUI module configuration
============================

The configuration of the BlockUI module can be modified via the **blockUIConfigProvider** during the config phase of your Angular application:

    angular.module('myApp').config(function(blockUIConfigProvider) {
      
      // Change the default overlay message
      blockUIConfigProvider.message('Please stop clicking!');
      
      // Change the default delay to 100ms before the blocking is visible
      blockUIConfigProvider.delay(100);
      
    });

### Methods

#### message
Changes the default message to be used when no message has been provided to the *start* method of the service. Default value is *'Loading ...'*.

    // Change the default overlay message
    blockUIConfigProvider.message('Please wait');

#### delay
Specifies the amount in milliseconds before the block is visible to the user. By delaying a visible block your application will appear more responsive. The default value is *250*.

    // Change the default delay to 100ms before the blocking is visible ...
    blockUIConfigProvider.delay(100);
    
    // ... or completely remove the delay
    blockUIConfigProvider.delay(1);
    
#### template
Specifies a custom template to use as the overlay.

    // Provide a custom template to use
    blockUIConfigProvider.template('<div class="block-ui-overlay">{{ message }}</div>');

#### templateUrl
Specifies a url to retrieve the template from. *The current release only works with pre-cached templates, which means that this url should be known in the $templateCache service of Angular. If you're using the grunt with html2js or angular-templates, which I highly recommend, you're already set.*

    // Provide the custom template via a url
    blockUIConfigProvider.templateUrl('my-templates/block-ui-overlay.html');

#### autoBlock
By default the BlockUI module will start a block whenever the Angular *$http* service has an pending request. If you don't want this behaviour and want to do all the blocking manually you can change this value to *false*.

    // Disable automatically blocking of the user interface
    blockUIConfigProvider.autoBlock(false);

#### resetOnException
By default the BlockUI module will reset the block count and hide the overlay whenever an exception has occurred. You can set this value to *false* if you don't want this behaviour.

    // Disable clearing block whenever an exception has occurred
    blockUIConfigProvider.resetOnException(false);
    
#### requestFilter
Allows you to specify a filter function to exclude certain ajax requests from blocking the user interface. The function is passed the [Angular request config object](http://docs.angularjs.org/api/ng/service/$http). The blockUI service will ignore requests when the function returns `false`.

	// Tell the blockUI service to ignore certain requests
    blockUIConfigProvider.requestFilter(function(config) {
    
      // If the request starts with '/api/quote' ...
      if(config.url.match(/^\/api\/quote($|\/).*/)) {
        return false; // ... don't block it.
      }
    });
