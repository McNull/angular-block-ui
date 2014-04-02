describe('block-ui-service', function () {

  var blockUI;

  beforeEach(function() {

    module('blockUI');

    inject(function(_blockUI_) {
      blockUI = _blockUI_;
    });

  });

  describe('construction', function () {

    it('should create the service', function () {

      expect(blockUI).toBeDefined();
      expect(blockUI).not.toBeNull();
      expect(blockUI.constructor.name).toBe('BlockUI');
      
    });

    it('should create main block-ui service with state', function() {

      var state = blockUI.state();

      expect(state).toBeDefined();
      expect(state).not.toBeNull();
      expect(state.id).toBe('main');

    });

    
  }); // construction

  describe('instances', function() {

    it('should create instances property', function() {
      
      var instances = blockUI.instances;

      expect(instances).toBeDefined();
      expect(instances).not.toBeNull();
        
    });

    it('should set main block-ui instance property', function() {
      
      var instances = blockUI.instances;
      
      expect(instances.main).toBe(blockUI);

    });

    it('should add new block-ui instance', function() {

      var instances = blockUI.instances;
      var result = instances.add('myId');

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(result.constructor.name).toBe('BlockUI');
      expect(result.state().id).toBe('myId');
      expect(instances.myId).toBe(result);

    });

    describe('remove', function() {

      beforeEach(function() {
        blockUI.instances.add('removeMe');
      });

      it('should remove instance by id', function() {

        expect(blockUI.instances.removeMe).toBeDefined();

        blockUI.instances.remove('removeMe');

        expect(blockUI.instances.removeMe).toBeUndefined();

      });

      it('should remove instance by instance', function() {

        expect(blockUI.instances.removeMe).toBeDefined();

        blockUI.instances.remove(blockUI.instances.removeMe);

        expect(blockUI.instances.removeMe).toBeUndefined();
        
      });

      it('should call reset on the removed instance', function() {

        var instance = blockUI.instances.removeMe;
        
        expect(instance).toBeDefined();

        spyOn(instance, 'reset');

        blockUI.instances.remove(instance);

        expect(instance.reset).toHaveBeenCalled();

      });

    }); // remove

    describe('start', function() {

      it('should increase the block count', function() {

        var state = blockUI.state();

        blockUI.start();

        expect(state.blockCount).toBe(1);

        blockUI.start();

        expect(state.blockCount).toBe(2);

      });

    }); // start

    describe('stop', function() {

      it('should decrease the block count', function() {

        var state = blockUI.state();
        
        state.blockCount = 10;

        blockUI.stop();

        expect(state.blockCount).toBe(9);

        blockUI.stop();

        expect(state.blockCount).toBe(8);

      });

      it('should not decrease the block count < 0', function() {

        var state = blockUI.state();
        
        state.blockCount = 0;

        blockUI.stop();

        expect(state.blockCount).toBe(0);

      });

      it('should call reset when block count == 0', function() {

        spyOn(blockUI, 'reset');

        var state = blockUI.state();
        
        state.blockCount = 1;

        blockUI.stop();

        expect(blockUI.reset).toHaveBeenCalledWith(true /* executeCallbacks */);

      });

    }); // stop

    
  });

});