angular.module('myApp', [
  'ngRoute',
  'ngSanitize',
//  'ngResource',
  'ngAnimate',
  'blockUI',
  'markdown',
  'responseLag',
  'inform',
  'inform-exception',
  'inform-http-exception'
], null).value('navItems', [
  {
    text: 'Home',
    url: '#!/'
  },
  {
    text: 'Documentation',
    url: '#!/examples',
    pattern: '/examples(/.*)?'
  }
]).config(function ($routeProvider, examplesRoutes) {

  $routeProvider.when('/', {
    templateUrl: 'app/main/home.ng.html'
  });

  angular.forEach(examplesRoutes, function (value, key) {
    $routeProvider.when(key, value);
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}).config(function (blockUIConfig, responseLagConfig, $locationProvider) {

  // Enable hashbangs

  $locationProvider.hashPrefix('!');

  blockUIConfig.blockBrowserNavigation = true;
  
  if(window.location.search.indexOf('delay=false')!=-1 ||
    window.location.search.indexOf('_escaped_fragment_')!=-1 ||
    window.navigator.userAgent.indexOf('Prerender')!=-1) {

    responseLagConfig.enabled = false;
    blockUIConfig.autoBlock = false;
    blockUIConfig.autoInjectBodyBlock = false;
  } else {
    responseLagConfig.excludes.push(/.*\.md/i);
    responseLagConfig.enabled = true;
    responseLagConfig.timeout.min = 750;
    responseLagConfig.timeout.max = 1500;

//    // Change the displayed message based on the http verbs being used.
//    blockUIConfig.requestFilter = function(config) {
//
//      var message;
//
//      switch(config.method) {
//
//        case 'GET':
//          message = 'Getting ...';
//          break;
//
//        case 'POST':
//          message = 'Posting ...';
//          break;
//
//        case 'DELETE':
//          message = 'Deleting ...';
//          break;
//
//        case 'PUT':
//          message = 'Putting ...';
//          break;
//      }
//
//      return message;
//
//    };
  }

//  blockUIConfig.template = '<pre><code>{{ state | json }}</code></pre>';

//  blockUIConfig.delay = 200;

}).controller('MainController', function($scope, blockUI) {
//  blockUI.start();
});
