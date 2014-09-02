angular.module('myApp').directive('myAnimationTester', function(blockUI, $compile, $timeout) {

  var $ = angular.element;

  function locateElementWithClass($element, className) {

    var ret;

    if($element.hasClass(className)) {
      ret = $element;
    } else {
      var children = $element.children();

      var i = children.length;

      while(i-- && !ret) {
        var $c = $(children[i]);
        ret = locateElementWithClass($c, className);
      }
    }

    return ret;
  }

  return {
    restrict: 'AE',
    scope: true,
    templateUrl: 'app/examples/animation-tester.ng.html',
    link: function($scope, $element, $attrs) {

      $scope.animation = $attrs.myAnimationTester;
      var instanceName = 'anim-test-' + $attrs.myAnimationTester;
      var instance = blockUI.instances.get(instanceName);
      var state = instance.state();

      var $blockUI = locateElementWithClass($element, 'block-ui-target');
      $blockUI.attr('block-ui', instanceName);
      $blockUI.attr('block-ui-animation', $attrs.myAnimationTester);

      $compile($blockUI)($scope);

      $scope.fakeSubmit = function() {
        instance.start(state.message);

        $timeout(function() {
          instance.stop();
        }, 1000);

      };

      $scope.activeBlock = function(value) {
        if(value) {
          state.blockCount += 1;
        } else {
          state.blockCount -= 1;
        }
      };

      $scope.state = state;

    }
  };

});
