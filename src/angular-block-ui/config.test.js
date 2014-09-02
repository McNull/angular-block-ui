describe('angular-block-ui config', function () {

  describe('custom template', function () {

    it('should override the default template', function () {

      // Arrange

      var provider, $templateCache, template = '<div>Magic!</div>', config;

      angular.module('i.am.so.fake', []).config(function (blockUIConfigProvider) {
        provider = blockUIConfigProvider;
        provider.template(template);
      });

      module('blockUI', 'i.am.so.fake');

      inject(function (_$templateCache_) {
        $templateCache = _$templateCache_;
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


});
