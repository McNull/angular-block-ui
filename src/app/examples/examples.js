angular.module('myApp').constant('examplesRoutes', {
  '/examples': {
      templateUrl: 'app/examples/examples.tmpl.html',
      controller: 'ExamplesController'
    }
});

angular.module('myApp').controller('ExamplesController', function($scope) {
  
  $scope.examples = [{
    name: 'Manual Blocking',
    tmpl: 'app/examples/manual-blocking.html'
  }, {
    name: 'Element Blocking',
    tmpl: 'app/examples/element-blocking.html'
  }];
  
  $scope.examples.active = 0;

});