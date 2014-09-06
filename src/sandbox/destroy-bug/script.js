// Code goes here

var app = angular.module('myApp', ['inform', 'inform-exception', 'blockUI', 'responseLag']);

app.config(function(blockUIConfig) {

  // For this demo we'll disable the "fullscreen" body block
  blockUIConfig.autoInjectBodyBlock = false;
  
});

// Our people controller for the main view. It monitors the pager.index
// property and reflects the data by querying the myPeopleResource.

app.controller('PeopleCtrl', function($scope, blockUI, myPeopleResource, inform, $timeout) {

  $scope.grid = {
    pager: {
      index: 0,
      size: 20
    },
    items: []
  };

  $scope.$watch('grid.pager.index', function(value) {
    
    if(value !== undefined) {
      myPeopleResource.query({
        limit: $scope.grid.pager.size,
        skip: $scope.grid.pager.size * value
      }).then(function(result) {
        $scope.grid.items = result.items;
        $scope.grid.pager.count = Math.ceil(result.totalItems / $scope.grid.pager.size);
      });
    }
    
  });

  $scope.click = function(person) {
    var personBlock = blockUI.instances.get('person-block-' + person.id);

    personBlock.start();

    $timeout(function() {
//      personBlock.stop();
    }, 1000);
  };
});

// A fake resource object that returns our fake data.
// Every http request will be captured by the block-ui that is associated 
// with the request url -- in this case 'people-data.json'.

app.factory('myPeopleResource', function($q, $http) {

  return {
    query: function(args) {
      
      args = args || {};
      args.limit = args.limit || 20;
      args.skip = args.skip || 0;
      
      var defer = $q.defer();
      
      $http.get('people-data.json')
        .success(function(items) {
          
          var result = {
            totalItems: items.length,
            items: items.slice(args.skip, args.skip + args.limit)
          };
          
          defer.resolve(result);
        });
      
      return defer.promise;
      
    }
  };
  
});

// The pager shown above the grid. 

app.directive('myPager', function() {

  return {
    templateUrl: 'my-pager.html',
    scope: {
      pageIndex: '=',
      pageCount: '='
    },
    link: function($scope) {

      $scope.index = function(value) {
        if (value !== undefined) {
          $scope.pageIndex = value;
        }

        return $scope.pageIndex;
      };

      $scope.move = function(value) {
        $scope.pageIndex += value;
        $scope.pageIndex = Math.max($scope.pageIndex, 0);
        $scope.pageIndex = Math.min($scope.pageIndex, $scope.pageCount - 1);
      };

      $scope.getIndex = function(value) {
        $scope.index = value;
      };

      $scope.$watch('pageCount', function(value) {
        $scope.pages = [];

        if (value >= 1) {
          while (value--) {
            $scope.pages.unshift(value);
          }
        }
      });

    }
  };

});
