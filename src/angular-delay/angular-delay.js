angular.module('delay', []);

angular.module('delay').constant('delayConfig', {
  enabled: true, // Enable or disable the delay
  timeout: {
    min: 200, // Minimum delay
    max: 1500 // Maximum delay
  },
  excludes: [] // Array of RegExp of urls to exclude
});

angular.module('delay').factory('delayHttpInterceptor', function($q, $templateCache, $timeout, delayConfig) {

  function includeRequest(config) {
    if (delayConfig.enabled && $templateCache.get(config.url) === undefined) {

      var patterns = delayConfig.excludes;
      var i = patterns.length;

      while (i--) {
        if (patterns[i].test(config.url)) {
          return false;
        }
      }

      return true;
    }
  }

  var t1 = delayConfig.timeout.min;
  var t2 = delayConfig.timeout.max - t1;

  return {
    request: function(config) {

      // Don't delay cached requests

      if (!includeRequest(config)) {
        return config;
      }

      var d = $q.defer();

      var delay = Math.floor(Math.random() * t2) + t1;

      $timeout(function() {
        d.resolve(config);
      }, delay);

      return d.promise;
    }
  };
});

angular.module('delay').config(function($httpProvider) {
  $httpProvider.interceptors.push('delayHttpInterceptor');
});
