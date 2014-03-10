angular.module('myApp', ['ngRoute', 'ngResource', 'templates-app', 'blockUI', 'showdown'], null).value('navItems', [{
  text: 'Home',
  url: '#/'
}, {
  text: 'Examples',
  url: '#/examples',
  pattern: '/examples(/.*)?'
}, {
  text: 'Quotes',
  url: '#/quote',
  pattern: "/quote(/.*)?"
}]).config(function($routeProvider, quoteRoutes, examplesRoutes) {

  $routeProvider.when('/', {
    templateUrl: 'app/main/home.tmpl.html'
  });

  angular.forEach(quoteRoutes, function(value, key) {
    $routeProvider.when(key, value);
  });

  angular.forEach(examplesRoutes, function(value, key) {
    $routeProvider.when(key, value);
  });

  $routeProvider.otherwise({
    redirectTo: '/'
  });

}).config(function(blockUIConfigProvider) {
  // blockUIConfigProvider.requestFilter(function(config) {
  //   if(config.url.match(/^\/api\/quote($|\/).*/)) {
  //     return false;
  //   }
  // });
  //blockUIConfigProvider.message('Fun with config');
  // blockUIConfigProvider.autoBlock(false);
  //blockUIConfigProvider.template('<div class="block-ui-overlay">{{ message }}</div>');
});
