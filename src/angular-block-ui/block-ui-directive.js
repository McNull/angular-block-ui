blkUI.directive('blockUi', function(blockUiCompileFn) {

  return {
    restrict: 'A',
    require: ['blockUi'],
    compile: blockUiCompileFn
  };

}).factory('blockUiCompileFn', function(blockUiPreLinkFn, blockUiPostLinkFn) {

  return function($element, $attrs) {

    $element.append('<div block-ui-container></div>');

    return {
      pre: blockUiPreLinkFn,
      post: blockUiPostLinkFn
    };

  };

}).factory('blockUiPreLinkFn', function(blockUI, blockUIUtils) {

  return function($scope, $element, $attrs) {

    // Create the blockUI instance
    // Prefix underscore to prevent integers:
    // https://github.com/McNull/angular-block-ui/pull/8

    var instanceId = $attrs.blockUi || '_' + $scope.$id;
    var srvInstance = blockUI.instances.get(instanceId);

    // Ensure the instance is released when the scope is destroyed

    $scope.$on('$destroy', function() {
      srvInstance.release();
    });

    // Increase the reference count

    srvInstance.addRef();

    // If a pattern is provided assign it to the state

    var pattern = $attrs.blockUiPattern;

    if(pattern) {
      var regExp = blockUIUtils.buildRegExp(pattern);
      srvInstance.pattern(regExp);
    }

    // Look for a parent instance and associate it with this instance.

    srvInstance._parent = $element.inheritedData('block-ui');

    // Associate this element with this instance.

    $element.data('block-ui', srvInstance);

  };

}).factory('blockUiPostLinkFn', function(blockUIConfig) {

  return function($scope, $element, $attrs, $ctrls) {

    var ctrl = $ctrls[0];

    var instance = $element.data('block-ui');

    if(!instance) {
      throw new Error('Failed to locate blockUI instance.');
    }

    // If the element does not have the class "block-ui" set, we set the
    // default css classes from the config.

    if(!$element.hasClass('block-ui')) {
      $element.addClass(blockUIConfig.cssClass);
    }

    // Set the aria-busy attribute if needed

    $scope.$watch(function() {
      return instance.state().blocking;
    }, function (value) {
      $element.attr('aria-busy', value);
    });

    // If this is the main (topmost) block element we'll also need to block any
    // location changes while the block is active.

    if (!instance._parent) {

      // After the initial content has been loaded we'll spy on any location
      // changes and discard them when needed.

      var fn = $scope.$on('$viewContentLoaded', function($event) {

        // Unhook the view loaded and hook a function that will prevent
        // location changes while the block is active.

        fn();
        $scope.$on('$locationChangeStart', function(event) {
          if (instance.state().blockCount > 0) {
            event.preventDefault();
          }
        });
      });
    }
  };

});