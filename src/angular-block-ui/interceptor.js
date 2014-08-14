angular.module('blockUI').factory('blockUIHttpInterceptor', function($q, $injector, blockUIConfig) {

  var blockUI;

  function injectBlockUI() {
    blockUI = blockUI || $injector.get('blockUI');
  }

  function stopBlockUI(config) {
    if (blockUIConfig.autoBlock && !config.$_noBlock && config.$_blocks) {
      injectBlockUI();
      config.$_blocks.stop();
    }
  }

  function error(rejection) {
    stopBlockUI(rejection.config);
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
      stopBlockUI(response.config);
      return response;
    },

    responseError: error
  };

});
