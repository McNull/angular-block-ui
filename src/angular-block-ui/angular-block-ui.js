angular.module('blockUI', ['templates-angularBlockUI']);

angular.module('blockUI').config(function($provide, $httpProvider) {

  $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
    function($delegate, $injector) {
      var blockUI, blockUIConfig;

      return function(exception, cause) {

        blockUIConfig = blockUIConfig || $injector.get('blockUIConfig');

        if (blockUIConfig.resetOnException) {
          blockUI = blockUI || $injector.get('blockUI');
          blockUI.instances.reset();
        }

        $delegate(exception, cause);
      };
    }
  ]);

  $httpProvider.interceptors.push('blockUIHttpInterceptor');
});

angular.module('blockUI').run(function($document) {
  $document.find('body').append('<div block-ui></div>');
});
