angular.module('myApp')

  .factory('Quote', function ($resource) {
    return $resource('/api/quote/:id', {id: '@id'});
  })

  .constant('quoteRoutes', {

    '/quote': {
      templateUrl: 'app/quote/list.tmpl.html',
      controller: 'QuoteListController',
      resolve: {
        model: ['$route', 'Quote', function ($route, Quote) {
          return Quote.query({}).$promise;
        }]
      }
    },

    '/quote/create': {
      templateUrl: 'app/quote/edit.tmpl.html',
      controller: 'QuoteEditController',
      resolve: {
        model: ['$route', 'Quote', function ($route, Quote) {
          return new Quote();
        }]
      }
    },

    '/quote/:id': {
      templateUrl: 'app/quote/edit.tmpl.html',
      controller: 'QuoteEditController',
      resolve: {
        model: ['$route', 'Quote', function ($route, Quote) {
          return Quote.get({ id: $route.current.params.id }).$promise;
        }]
      }
    }
  })

  .controller('QuoteListController', function ($scope, model, $location) {

    $scope.quotes = model;

    $scope.edit = function (quote) {
      $location.path('/quote/' + quote.id);
    };
    
  })

  .controller('QuoteEditController', function ($scope, model, $location, notifications) {

    $scope.quote = model;

    $scope.save = function () {
      if ($scope.quoteForm.$valid) {
        $scope.quote.$save().then(function () {
          notifications.add("Quote saved.", 'info', 1);
          $location.path('/quote');
        });

      }
    }

  });