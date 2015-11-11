
var app = angular.module('myApp', ['blockUI']);

app.directive('blockUiAnimate', function () {

  var cssClass = 'block-ui-animate';
  var startEvent = 'block-ui-visible-start';
  var visibleLoop = 'block-ui-visible-loop';
  var endEvent = 'block-ui-visible-end';
  var transitionEndEvent = 'transitionend webkitTransitionEnd';

  return {
    priority: -100,
    restrict: 'AC',
    link: function ($scope, $element, $attrs) {
      var instance = $element.data('block-ui'),
        onStartEvent, onEndEvent, enabled;

      // Handler for the transitionend event for the start animation
      function startTransitionEnd() {
        if (instance.isBlocking()) {
          $element.addClass(visibleLoop);
        }

        $element.removeClass(startEvent);
      }
      
      // Handler for the transitionend event for the end animation
      function endTransitionEnd() {
        $element.removeClass(endEvent);
      }
      
      function enable() {

        if (!enabled) {
          $element.addClass(cssClass);

          onStartEvent = $scope.$on(startEvent, function (e, args) {
            if (args.instance === instance) {
              
              // Remove any transitionend registration for the end animation and
              // execute it manually to remove any classes
              
              $element.off(transitionEndEvent, endTransitionEnd);
              endTransitionEnd();
              
              $element.one(transitionEndEvent, startTransitionEnd);
              $element.addClass(startEvent);
            }
          });

          onEndEvent = $scope.$on(endEvent, function (e, args) {
            if (args.instance === instance) {
              
              // Remove any transitionend registration for the start animation and
              // execute it manually to remove any classes
              
              $element.off(transitionEndEvent, startTransitionEnd);
              startTransitionEnd();
              
              $element.one(transitionEndEvent, endTransitionEnd);
              $element.removeClass(visibleLoop);
              $element.addClass(endEvent);
            }
          });

          enabled = true;
        }

      }

      function disable() {

        $element.removeClass(cssClass);

        if (onStartEvent) {
          onStartEvent(); onStartEvent = null;
        }

        if (onEndEvent) {
          onEndEvent(); onEndEvent = null;
        }

        enabled = false;
      }

      $attrs.$observe('blockUiAnimate', function (value) {
        value !== 'false' ? enable() : disable();
      });
    }
  };
});



app.controller('MyController', function ($scope, blockUI) {
  var block = blockUI.instances.get('blockUIAnimated');

  $scope.toggleBlock = function () {
    block.isBlocking() ? block.stop() : block.start();
  };

  $scope.toggleBlock();

  $scope.model = {
    animate: true,
    startEndAnimations: [
      'block-ui-animate-scale',
      'block-ui-animate-flip'
    ],
    startEndAnimation: 'block-ui-animate-scale',
    visibleAnimations: [
      'block-ui-animate-text-slide'
    ],
    visibleAnimation: null,
    cssClass: function () {
      var ret = '';

      if ($scope.model.animate) {

        if ($scope.model.startEndAnimation) {
          ret += $scope.model.startEndAnimation + ' ';
        }

        if ($scope.model.visibleAnimation) {
          ret += $scope.model.visibleAnimation + ' ';
        }

      }

      return ret;
    }
  };

});