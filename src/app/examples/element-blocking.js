
angular.module('myApp').controller('ElementBlockingController', function($scope) {

});

angular.module('myApp').directive('myDemoTable', function() {
  return {
    templateUrl: 'app/examples/my-demo-table.tmpl.html',
    controller: function($scope, myFakeDataResource) {
      $scope.table = {
        items: [],
        offset: 0,
        previous: function() {
          $scope.table.offset = Math.max(0, $scope.table.offset - 10);
        },
        next: function() {
          $scope.table.offset = Math.min(40, $scope.table.offset + 10);
        }
      };
      
      $scope.$watch('table.offset', function(value) {
        myFakeDataResource.query({ limit: 10, offset: value }).$promise.then(function(data) {
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