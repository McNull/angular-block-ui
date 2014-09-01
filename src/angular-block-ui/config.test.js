describe('angular-block-ui config', function () {

  var $templateCache = null;

  function initConfig(configCallbackFn) {

    var fakeModule = angular.module('i.am.so.fake', []);

    if(configCallbackFn) {
      fakeModule.config(['blockUIConfig', configCallbackFn]);
    }

    module('blockUI', 'i.am.so.fake');

    var config = null;

    inject(function(_blockUIConfig_, _$templateCache_) {
      config = _blockUIConfig_;
      $templateCache = _$templateCache_;
    });

    return config;
  }

  describe('custom template', function () {

    it('should override the default template', function () {

      // Arrange

      var template = '<div>Magic!</div>';

      var config = initConfig(function(cfg) {
        cfg.template = template;
      });

      // Act

      inject(function(_blockUIConfig_) {
        config = _blockUIConfig_;
      });

      // Assert

      expect(config.templateUrl).toBe('$$block-ui-template$$');
      expect($templateCache.get(config.templateUrl)).toBe(template);
    });

  });

  describe('cssClass', function() {

    it('should contain block-ui class by default', function () {

      // Arrange


      // Act

      var config = initConfig();

      // Assert

      expect(config.cssClass).toBeDefined();
      expect(config.cssClass.indexOf('block-ui')).not.toBe(-1);

    });

    it('should add single class by string', function () {

      // Arrange

      // Act

      var config = initConfig(function(configProvider) {

        configProvider.cssClass += ' my-css-class';

      });

      expect(config.cssClass.indexOf('block-ui')).not.toBe(-1);
      expect(config.cssClass.indexOf('my-css-class')).not.toBe(-1);
    });

  });
});
