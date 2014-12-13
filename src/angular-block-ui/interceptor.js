blkUI.factory('blockUIHttpInterceptor', function($q, $injector, blockUIConfig, $templateCache) {

  var blockUI;

  function injectBlockUI() {
    blockUI = blockUI || $injector.get('blockUI');
  }

  function stopBlockUI(config) {
    if (blockUIConfig.autoBlock && (config && !config.$_noBlock && config.$_blocks)) {
      injectBlockUI();
      config.$_blocks.stop();
    }
  }

  function error(rejection) {

    try {
      stopBlockUI(rejection.config);
    } catch(ex) {
      console.log('httpRequestError', ex);
    }

    return $q.reject(rejection);
  }

  return {
    request: function(config) {

      // Only block when autoBlock is enabled ...
      // ... and the request doesn't match a cached template.

      if (blockUIConfig.autoBlock &&
        !(config.method == 'GET' && $templateCache.get(config.url))) {

        // Don't block excluded requests

        var result = blockUIConfig.requestFilter(config);

        if (result === false) {
          // Tag the config so we don't unblock this request
          config.$_noBlock = true;
        } else {

          injectBlockUI();

          config.$_blocks = blockUI.instances.locate(config);
          config.$_blocks.start(result);
        }
      }

      return config;
    },

    requestError: error,

    response: function(response) {

      // If the connection to the website goes down the response interceptor gets and error with "cannot read property config of null".
      // https://github.com/McNull/angular-block-ui/issues/53

      if(response) {
        stopBlockUI(response.config);
      }

      return response;
    },

    responseError: error
  };

});
