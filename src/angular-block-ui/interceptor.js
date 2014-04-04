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

          config.$_blocks = blockUI.instances.locate(config);
          config.$_blocks.start();
        }
      }

      return config;
    },

    requestError: error,

    response: function(response) {

      // Check if the response is tagged to ignore

      var cfg = response.config;

      if (blockUIConfig.autoBlock && !cfg.$_noBlock && cfg.$_blocks) {
        injectBlockUI();
        cfg.$_blocks.stop();
      }

      return response;
    },

    responseError: error
  };

});
