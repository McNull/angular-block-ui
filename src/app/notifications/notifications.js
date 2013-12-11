angular.module('myApp').factory('notifications', function() {

  var messages = [];

  function add(text, type, ttl) {
    messages.push({
      text: text,
      type: type || 'info',
      ttl: ttl || 0
    });
  }

  function remove(message) {
    _.remove(messages, message);
  }

  function clear() {
    messages.length = 0;
  }

  function tick() {
    if (messages.length) {
      _.remove(messages, function(message) {
        return message.ttl-- <= 0;
      });
    }
  }

  return {
    add: add,
    remove: remove,
    clear: clear,
    tick: tick,
    messages: messages
  };
});

angular.module('myApp').config(function($provide) {
  $provide.decorator("$exceptionHandler", ['$delegate', 'notifications',
    function($delegate, notifications) {
      return function(exception, cause) {
        // debugger;
        $delegate(exception, cause);
        notifications.add(exception.toString(), 'error');
      };
    }
  ]);
});

angular.module('myApp').controller('NotificationsController', function($scope, notifications) {
  $scope.notifications = notifications;
});

angular.module('myApp').directive('notifications', function() {
  return {
    templateUrl: 'app/notifications/notifications.tmpl.html',
    controller: 'NotificationsController',
    restrict: 'AEC',
    replace: true
  };
});

angular.module('myApp').factory('errorHttpInterceptor',
  function($q, notifications) {
    return {
      'responseError': function(rejection) {
        // do something on error
         var msg = 'Network error (' + rejection.status + '): ' + rejection.data;
         notifications.add(msg, 'error');
         return $q.reject(rejection);
      }
    };
  });

if (!window.jasmine) {
  angular.module('myApp').run(function($rootScope, notifications) {
    $rootScope.$on("$locationChangeStart", function( /* event, nextLocation, currentLocation */ ) {
      notifications.tick();
    });
  });

  angular.module('myApp').config(function ($httpProvider) {
     //$httpProvider.responseInterceptors.push('errorHttpInterceptor');
     $httpProvider.interceptors.push('errorHttpInterceptor');
  });
}