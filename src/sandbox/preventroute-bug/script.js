// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute', 'blockUI']);

var x = 0;
// configure our routes
scotchApp.config(function ($routeProvider) {
  $routeProvider
  // route for the home page
  .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'mainController'
  })

  // route for the about page
  .when('/about', {
    templateUrl: 'pages/about.html',
    controller: 'aboutController'
  })

  // route for the contact page
  .when('/contact', {
    templateUrl: 'pages/contact.html',
    controller: 'contactController'
  })

  .otherwise({
    redirectTo: '/'
  });
});

// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function ($scope, $timeout, $location, blockUI) {
  // create a message to display in our view
  $scope.message = 'Everyone come and see how good I look!';

  blockUI.start();

  $timeout(function () {
    //$location.path('/about');

//    blockUI.stop();
  }, 1000);

});

scotchApp.controller('aboutController', function ($scope) {
  $scope.message = 'Look! I am an about page.';
});

scotchApp.controller('contactController', function ($scope) {
  $scope.message = 'Contact us! JK. This is just a demo.';
});