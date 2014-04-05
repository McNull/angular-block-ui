angular.module('myApp').constant('examplesRoutes', {
  '/examples': {
      templateUrl: 'app/examples/examples.tmpl.html',
      controller: 'ExamplesController'
    }
});

angular.module('myApp').controller('ExamplesController', function($scope) {
  
  $scope.examples = [{
    name: 'Documentation',
    tmpl: 'app/examples/readme.html'
  }, {
    name: 'Manual Blocking Examples',
    tmpl: 'app/examples/manual-blocking.html'
  }, {
    name: 'Element Blocking Examples',
    tmpl: 'app/examples/element-blocking.html'
  }];
  
  $scope.examples.active = 0;

});