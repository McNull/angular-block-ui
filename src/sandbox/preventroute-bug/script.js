// create the module and name it scotchApp
var scotchApp = angular.module('scotchApp', ['ngRoute', 'blockUI']);


//function decorateLocation($delegate) {
//  window.ll = $delegate;
//
//  var overrides = [
//    'url', 'path', 'search', 'hash', 'state'
//  ];
//  
//  function hook(f) {
//    var s = $delegate[f];
//    $delegate[f] = function() {
//      console.log(f);
//      return s.apply($delegate, arguments);
//    };
//  }
//  
//  angular.forEach(overrides, hook);
//  
//  return $delegate;
//}
//
//scotchApp.config(function ($provide) {
//  $provide.decorator('$location', decorateLocation);
//});


scotchApp.config(function (blockUIConfig) {
  //  blockUIConfig.preventRouting = false;
});

// configure our routes
scotchApp.config(function ($routeProvider) {
  $routeProvider
  // route for the home page
    .when('/', {
    templateUrl: 'pages/home.html',
    controller: 'mainController',
    reloadOnSearch: false
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

  function tick(t) {
    $location.search({
      t: t
    }).hash('gedoe' + t);
    $timeout(function () {
      tick(t + 1);
    }, 500);
  }

  $timeout(function() {
    tick(0);  
  });
  

  //  blockUI.start();

  //  $timeout(function () {
  //    $location.path('/about');
  //
  ////    blockUI.stop();
  //  });

});

scotchApp.controller('aboutController', function ($scope, $timeout, $location) {
  $scope.message = 'Look! I am an about page.';

  //  $timeout(function () {
  //    $location.path('/');  
  //
  ////    blockUI.stop();
  //  }, 1000);

});

scotchApp.controller('contactController', function ($scope) {
  $scope.message = 'Contact us! JK. This is just a demo.';
});