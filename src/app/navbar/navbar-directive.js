angular.module('myApp').directive('navbar', function ($location) {

  var routePatternAttribute = 'data-route-pattern';

  return {
    restrict: 'A',
    templateUrl: 'app/navbar/navbar.ng.html',
    controller: 'NavbarController',
    replace: true
  };
});
