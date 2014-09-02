angular.module('myApp').directive('myDemoTable', function(myFakeDataResource) {
  return {
    templateUrl: 'app/examples/my-demo-table.ng.html',
    link: function($scope, $element, $attrs) {

      $scope.table = {
        items: [],
        offset: 0,
        limit: 10,
        previous: function() {
          $scope.table.offset = Math.max(0, $scope.table.offset - 10);
        },
        next: function() {
          $scope.table.offset = Math.min(40, $scope.table.offset + 10);
        },
        emptyRows: function() {
          return new Array($scope.table.limit - $scope.table.items.length);
        }
      };

      $scope.$watch($attrs.limit, function(v) {
        $scope.table.limit = v === undefined ? $scope.table.limit : v;
      });

      $scope.$watchCollection('[ table.offset, table.limit ]', function(value) {
        myFakeDataResource.query({ limit: $scope.table.limit, offset: $scope.table.offset }).$promise.then(function(data) {
          $scope.table.items = data;
        });
      });
    }
  };
});

angular.module('myApp').factory('myFakeDataResource', function($http, $q) {

  return {
    query: function(params) {

      var d = $q.defer();

      var ret = [];

      ret.$resolved = false;
      ret.$promise = d.promise;
      $http.get('app/examples/data-array.json').then(function(response) {
        
        ret.length = 0;
        
        if(params.offset + params.limit >= response.data.length) {
          params.offset = 0;
        }
        
        response.data = response.data.splice(params.offset, params.limit);
        Array.prototype.push.apply(ret, response.data);
      
        d.resolve(ret);
      });

      return ret;
    }
  };

});