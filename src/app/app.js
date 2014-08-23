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

}).config(function (blockUIConfigProvider, delayConfig) {

  delayConfig.excludes.push(/.*\.md/i);

  delayConfig.enabled = false;
  delayConfig.timeout.min = 1000;
  delayConfig.timeout.max = 2000;

//  blockUIConfigProvider.autoInjectBodyBlock(false);

  // blockUIConfigProvider.requestFilter(function(config) {
  //   if(config.url.match(/^\/api\/quote($|\/).*/)) {
  //     return false;
  //   }
  // });
  //blockUIConfigProvider.message('Fun with config');
  // blockUIConfigProvider.autoBlock(false);
  //blockUIConfigProvider.template('<div class="block-ui-overlay">{{ message }}</div>');
}).controller('MainController', function($scope, blockUI) {
//  blockUI.start();
});
