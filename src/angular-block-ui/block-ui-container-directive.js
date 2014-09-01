blkUI.directive('blockUiContainer', function (blockUIConfig, blockUiContainerLinkFn) {
  return {
    scope: true,
    restrict: 'A',
    templateUrl: blockUIConfig.templateUrl,
    link: blockUiContainerLinkFn
  };
}).factory('blockUiContainerLinkFn', function (blockUI, blockUIConfig, blockUIUtils) {

  return function ($scope, $element, $attrs) {

    var ctrl = $ctrls[0];

    $element.addClass('block-ui-container');

    var srvInstance = ctrl.instance;
    var messageClass = ctrl.attrs.cssClassMessage;

    if(messageClass) {
      var $message = blockUIUtils.findElement($element, 'block-ui-message');

      if($message) {
        $message.addClass(messageClass);
      }
    }

    // Expose the state on the scope

    $scope.state = srvInstance.state();

    $scope.$watch('state.blocking', function(value) {
      $element.toggleClass('block-ui-visible', !!value);
    });

    $scope.$watch('state.blockCount > 0', function(value) {
      $element.toggleClass('block-ui-active', !!value);
    });
  };
});