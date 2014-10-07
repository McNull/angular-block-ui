angular.module('myApp').constant('examplesRoutes', {
  '/examples': {
    redirectTo: '/examples/documentation'
  },
  '/examples/:example': {
    templateUrl: 'app/examples/examples.ng.html',
    controller: 'ExamplesController'
  }
});

angular.module('myApp').controller('ExamplesController', function($scope, $routeParams) {

  function urlToName(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
    return str.replace(/\W+(.)/g, function(i, c) {
      return ' ' + c.toUpperCase();
    });
  }

  function nameToUrl(str) {
    str = str.toLowerCase();
    return str.replace(/\s+/g, '-');
  }

  function indexOfExample(name, examples) {

    var i = examples.length;
    while (i--) {
      if (examples[i].name === name) {
        return i;
      }
    }
    return -1;
  }

  $scope.examples = [{
    name: 'Documentation',
    tmpl: 'app/examples/readme.html'
  }, {
    name: 'Manual Blocking Examples',
    tmpl: 'app/examples/manual-blocking.html'
  }, {
    name: 'Element Blocking Examples',
    tmpl: 'app/examples/element-blocking.html'
  }, {
    name: 'Focus Management',
    tmpl: 'app/examples/focus-input.html'
  }];

  $scope.examples.active = indexOfExample(urlToName($routeParams.example), $scope.examples);
  $scope.examples.getUrl = function(example) {
    return '#!/examples/' + nameToUrl(example.name);
  };

});
