angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'blockUI',
  'showdown',
  'delay',
  'inform',
  'inform-exception',
  'inform-http-exception'
], null).value('navItems', [
  {
    text: 'Home',
    url: '#/'
  },
  {
    text: 'Documentation',
    url: '#/examples',
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

}).config(function (blockUIConfig, delayConfig) {

  if(window.location.search.indexOf('delay=false')!=-1) {
    delayConfig.enabled = false;
  } else {
    delayConfig.excludes.push(/.*\.md/i);
    delayConfig.enabled = true;
    delayConfig.timeout.min = 1000;
    delayConfig.timeout.max = 2000;
  }

//  blockUIConfig.template = '<pre><code>{{ state | json }}</code></pre>';

//  blockUIConfig.delay = 200;

}).controller('MainController', function($scope, blockUI) {
//  blockUI.start();
});
