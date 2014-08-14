angular.module('blockUI').directive('blockUi', function(blockUI, blockUIConfig, blockUiLinkFn) {
  return {
    scope: true,
    restrict: 'A',
    templateUrl: blockUIConfig.template ? undefined : blockUIConfig.templateUrl,
    template: blockUIConfig.template,
    link: blockUiLinkFn
  };
}).factory('blockUiLinkFn', function(blockUI, blockUIUtils) {

  return function($scope, $element, $attrs) {
    
    var $parent = $element.parent();

    // Locate the parent element  

    if ($parent.length) {
      
      var srvInstance = blockUI;
      
      // If the parent is the body element, hook into the view loaded event

      if ($parent[0].tagName === 'BODY') {
        var fn = $scope.$on('$viewContentLoaded', function($event) {
 
          // Unhook the view loaded and hook a function that will prevent
          // location changes while the block is active.

          fn();
          $scope.$on('$locationChangeStart', function(event) {
            if ($scope.state.blockCount > 0) {
              event.preventDefault();
            }
          });
        });
      } else {

        // Ensure that the parent position is set to relative 

        $parent.css('position', 'relative');

        // Create the blockUI instance

        var instanceId = !$attrs.blockUi ? '_' + $scope.$id : $attrs.blockUi;

        srvInstance = blockUI.instances.get(instanceId);

        // Locate the parent blockUI instance

        var parentInstance = $element.inheritedData('block-ui');

        if(parentInstance) {

          // TODO: assert if parent is already set to something else
          
          srvInstance._parent = parentInstance;
        }

        // If a pattern is provided assign it to the state

        var pattern = $attrs.blockUiPattern;

        if(pattern) {
          var regExp = blockUIUtils.buildRegExp(pattern);
          srvInstance.pattern(regExp);
        }

        // Ensure the instance is released when the scope is destroyed

        $scope.$on('$destroy', function() {
          srvInstance.release();
        });

        // Increase the reference count

        srvInstance.addRef();
      }
      
      $element.addClass('block-ui');
      $parent.data('block-ui', srvInstance);
      $scope.state = srvInstance.state();
    }
  };
});
