describe('angular-block-ui', function () {

  describe('exception handler', function () {

    var $exceptionHandler, blockUI, config, configSrc;

    beforeEach(function () {

      module('blockUI');

      inject(function (_$exceptionHandler_, _blockUI_, _blockUIConfig_) {
        $exceptionHandler = _$exceptionHandler_;
        blockUI = _blockUI_;
        config = _blockUIConfig_;
      });

      configSrc = angular.copy(config);

    });

    afterEach(function() {
      config = angular.copy(configSrc, config);
    });

    it('should reset the main block on exception', function () {

      blockUI.start(); // set blockcount to 1

      try {
        $exceptionHandler(Error('Oops'), 'Your fault');
      }
      catch (e) {
      }

      expect(blockUI.state().blockCount).toBe(0);

    });

    it('should not reset the main block on exception if specified in the config', function () {

      config.resetOnException = false;
      blockUI.start(); // set blockcount to 1

      try {
        $exceptionHandler(Error('Oops'), 'Your fault');
      }
      catch (e) {
      }

      expect(blockUI.state().blockCount).toBe(1);

    });

    it('should reset the all blocks on exception', function () {

      var myInstance1 = blockUI.instances.get('myInstance1');
      var myInstance2 = blockUI.instances.get('myInstance2');

      blockUI.start(); // set blockcount to 1
      myInstance1.start(); // set blockcount to 1
      myInstance2.start(); // set blockcount to 1

      try {
        $exceptionHandler(Error('Oops'), 'Your fault');
      }
      catch (e) {
      }

      expect(blockUI.state().blockCount).toBe(0);
      expect(myInstance1.state().blockCount).toBe(0);
      expect(myInstance2.state().blockCount).toBe(0);

    });
  }); // exception handler
}); // angular-block-ui