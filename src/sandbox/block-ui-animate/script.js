
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

app.controller('MyController', function ($scope, blockUI, $timeout) {
  var block = blockUI.instances.get('blockUIAnimated');

  $scope.toggleBlock = function () {
    block.isBlocking() ? block.stop() : block.start();
  };

  $scope.toggleBlock();

  $scope.model = {
    animate: true,
    startEndAnimations: [
      'block-ui-animate-scale',
      'block-ui-animate-flip',
      'block-ui-animate-slide'
    ],
    startEndAnimation: 'block-ui-animate-flip',
    visibleAnimations: [
      'block-ui-animate-text-slide',
      'block-ui-animate-text-flash',
      'block-ui-animate-text-flip',
      'block-ui-animate-text-pulse'
    ],
    visibleAnimation: 'block-ui-animate-text-pulse',
    cssClass: function () {
      var ret = '';

      if ($scope.model.animate) {

        if ($scope.model.startEndAnimation) {
          ret += $scope.model.startEndAnimation + ' ';
        }

        if ($scope.model.visibleAnimation) {
          ret += $scope.model.visibleAnimation + ' ';
        }
        
        if(ret.length > 1) {
          ret = ret.substr(0, ret.length - 1);
        }
      }

      return ret;
    },
    htmlPreview: function() {
      
      var ret = '<div block-ui="myElementBlock"';
      
      if ($scope.model.animate) {
        ret += ' class="block-ui-animate';
        
        var css = $scope.model.cssClass();
        
        if(css) {
          ret += ' ' + css;
        }
        
        ret += '"'; 
      }
      
      ret += '>\n  <!-- ... -->\n  <p>Lorem ipsum dolor ...</p>\n  <!-- ... -->\n</div>';
      
      return ret;
    }
  };

  $scope.$watch('model.startEndAnimation', function (value, oldValue) {
    if (value !== oldValue) {
      $scope.toggleBlock();

      $timeout(function () {
        if (!block.isBlocking()) {
          $scope.toggleBlock();
        }
      }, 500);
    }
  });
 
});