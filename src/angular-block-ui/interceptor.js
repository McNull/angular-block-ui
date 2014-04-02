angular.module('blockUI').factory('blockUIHttpInterceptor', function($q, $injector, blockUIConfig) {

  var blockUI;

  function injectBlockUI() {
    blockUI = blockUI || $injector.get('blockUI');
  }

  function error(rejection) {
    if (blockUIConfig.autoBlock) {
      injectBlockUI();
      blockUI.stop();
    }

    return $q.reject(rejection);
  }

  return {
    request: function(config) {

      if (blockUIConfig.autoBlock) {

        // Don't block excluded requests

        if (blockUIConfig.requestFilter(config) === false) {
          // Tag the config so we don't unblock this request
          config.$_noBlock = true;
        } else {
          injectBlockUI();
          blockUI.start();
        }
      }

      return config;
    },

    requestError: error,

    response: function(response) {

      // Check if the response is tagged to ignore

      if (blockUIConfig.autoBlock && !response.config.$_noBlock) {
        injectBlockUI();
        blockUI.stop();
      }

      return response;
    },

    responseError: error
  };

});
