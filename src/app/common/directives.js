angular.module('myApp').directive('confirm', ['$window', function($window) {
  return {
    restrict: 'A',
    priority: 100,
    link: function(scope, element, attr) {
      element.bind('click', function(e) {
        var msg = attr.confirm;

        if(!$window.confirm(msg)) {
          e.stopImmediatePropagation();
          e.preventDefault();
        }
      });
    }
  };
}]);
