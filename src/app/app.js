angular.module('myApp', ['ngRoute', 'ngResource', 'templates-app'], null).value('navItems', [{
    text: 'Home',
    url: '#/'
}, {
    text: 'Quotes',
    url: '#/quote',
    pattern: "/quote(/.*)?"
}]).config(function($routeProvider, quoteRoutes) {

    $routeProvider.when('/', {
        templateUrl: 'app/main/home.tmpl.html'
    });

    angular.forEach(quoteRoutes, function(value, key) {
        $routeProvider.when(key, value);
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

});
