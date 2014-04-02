angular.module('blockUI').directive('blockUi', function(blockUI, blockUIConfig, blockUiLinkFn) {
  return {
    restrict: 'A',
    templateUrl: blockUIConfig.template ? undefined : blockUIConfig.templateUrl,
    template: blockUIConfig.template,
    link: blockUiLinkFn
  };
}).factory('blockUiLinkFn', function(blockUI) {

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

        var instanceId = $attrs.id === undefined ? $scope.$id : $attrs.id;

        srvInstance = blockUI.instances.add(instanceId);

        // If a pattern is provided assign it to the state

        var pattern = $attrs.blockUiPattern;

        if(pattern) {
          
          var match = pattern.match(/^\/(.*)\/([gim]*)$/);

          if(match) {
            var regExp = new RegExp(match[1], match[2]);
            srvInstance.pattern(regExp);
          } else {
            throw Error('Incorrect regular expression format: ' + pattern);
          }
        }

        // Ensure the instance is removed when the scope is destroyed

        $scope.$on('$destroy', function() {
          blockUI.instances.remove(srvInstance);
        });
      }
      
      $element.addClass('block-ui');
      $element.data('block-ui', srvInstance);
      $scope.state = srvInstance.state();
    }
  };
});
