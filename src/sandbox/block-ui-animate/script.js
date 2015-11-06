
var app = angular.module('myApp', ['blockUI']);

app.directive('blockUiAnimate', function ($timeout) {

  var startEvent = 'block-ui-visible-start';
  var visibleLoop = 'block-ui-visible-loop';
  var endEvent = 'block-ui-visible-end';
  var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  
  return {
    priority: -100,
    restrict: 'C',
    link: function ($scope, $element, $attrs) {   
      var instance = $element.data('block-ui');
      
      $scope.$on(startEvent, function(e, args) {
        if(args.instance === instance) {
          $element.addClass(startEvent);
          
          $element.one(animationEndEvent, function() {
            $element.addClass(visibleLoop);
            $element.removeClass(startEvent);
          });     
        }
      });
      
      $scope.$on(endEvent, function(e, args) {
        if(args.instance === instance) {
          $element.removeClass(visibleLoop);
          $element.addClass(endEvent);
          
          $element.one(animationEndEvent, function() {
            $element.removeClass(endEvent);
          });     
        }
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

});