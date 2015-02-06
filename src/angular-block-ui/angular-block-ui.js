var blkUI = angular.module('blockUI', []);

blkUI.config(function ($provide, $httpProvider) {

  $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
    function ($delegate, $injector) {
      var blockUI, blockUIConfig;

      return function (exception, cause) {

        blockUIConfig = blockUIConfig || $injector.get('blockUIConfig');

        if (blockUIConfig.resetOnException) {
          try {
            blockUI = blockUI || $injector.get('blockUI');
            blockUI.instances.reset();
          } catch (ex) {
            console.log('$exceptionHandler', exception);
          }
        }

        $delegate(exception, cause);
      };
    }
  ]);

  $httpProvider.interceptors.push('blockUIHttpInterceptor');
});

blkUI.run(function ($document, blockUIConfig, $templateCache) {
  if (blockUIConfig.autoInjectBodyBlock) {
    $document.find('body').attr('block-ui', 'main');
  }

  if (blockUIConfig.template) {

    // Swap the builtin template with the custom template.
    // Create a magic cache key and place the template in the cache.

    blockUIConfig.templateUrl = '$$block-ui-template$$';
    $templateCache.put(blockUIConfig.templateUrl, blockUIConfig.template);
  }
});

function moduleLoaded(name) {
  try {
    angular.module(name);
  } catch(ex) {
    return false;
  }
  return true;
}