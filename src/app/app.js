angular.module('myApp', ['ngRoute', 'ngResource', 'templates-app', 'blockUI'], null).value('navItems', [{
    text: 'Home',
    url: '#/'
}, {
    text: 'Quotes',
    url: '#/quote',
    pattern: "/quote(/.*)?"
}]).config(function($routeProvider, quoteRoutes, documentationRoutes) {

    $routeProvider.when('/', {
        templateUrl: 'app/main/home.tmpl.html'
    });

    angular.forEach(quoteRoutes, function(value, key) {
        $routeProvider.when(key, value);
    });

    angular.forEach(documentationRoutes, function(value, key) {
        $routeProvider.when(key, value);
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

}).config(function(blockUIConfigProvider) {
    blockUIConfigProvider.message('Fun with config');
});
