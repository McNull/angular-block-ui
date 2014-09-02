blkUI.directive('blockUi', function(blockUiCompileFn) {

  return {
    restrict: 'A',
    compile: blockUiCompileFn
  };

}).factory('blockUiCompileFn', function(blockUiPreLinkFn) {

  return function($element, $attrs) {
    $element.append('<div block-ui-container></div>');

    return {
      pre: blockUiPreLinkFn
    };

  };

}).factory('blockUiPreLinkFn', function(blockUI, blockUIUtils) {

  return function($scope, $element, $attrs) {

    $element.addClass('block-ui');

    // Create the blockUI instance
    // Prefix underscore to prevent integers:
    // https://github.com/McNull/angular-block-ui/pull/8

    var instanceId = $attrs.blockUi || '_' + $scope.$id;
    var srvInstance = blockUI.instances.get(instanceId);

    // If this is the main (topmost) block element we'll also need to block any
    // location changes while the block is active.

    if (instanceId === 'main') {

      // After the initial content has been loaded we'll spy on any location
      // changes and discard them when needed.

      var fn = $scope.$on('$viewContentLoaded', function($event) {

        // Unhook the view loaded and hook a function that will prevent
        // location changes while the block is active.

        fn();
        $scope.$on('$locationChangeStart', function(event) {
          if (srvInstance.state().blockCount > 0) {
            event.preventDefault();
          }
        });
      });
    } else {
      // Locate the parent blockUI instance
      var parentInstance = $element.inheritedData('block-ui');

      if(parentInstance) {
        // TODO: assert if parent is already set to something else
        srvInstance._parent = parentInstance;
      }
    }

    // Ensure the instance is released when the scope is destroyed

    $scope.$on('$destroy', function() {
      srvInstance.release();
    });

    // Increase the reference count

    srvInstance.addRef();

    // Set the aria-busy attribute if needed

    $scope.$watch(function() {
      return srvInstance.state().blocking;
    }, function (value) {
      $element.attr('aria-busy', value);
    });

    // If a pattern is provided assign it to the state

    var pattern = $attrs.blockUiPattern;

    if(pattern) {
      var regExp = blockUIUtils.buildRegExp(pattern);
      srvInstance.pattern(regExp);
    }

    // Store a reference to the service instance on the element

    $element.data('block-ui', srvInstance);
  };

});