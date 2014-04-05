describe('block-ui-service', function() {

  var blockUI;

  beforeEach(function() {

    module('blockUI');

    inject(function(_blockUI_) {
      blockUI = _blockUI_;
    });

  });

  describe('construction', function() {

    it('should create the service', function() {

      expect(blockUI).toBeDefined();
      expect(blockUI).not.toBeNull();
      // expect(blockUI.constructor.name).toBe('BlockUI'); // fails if minified

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

    describe('add', function() {

      it('should add new block-ui instance', function() {

        var instances = blockUI.instances;
        var result = instances.get('myId');

        expect(result).toBeDefined();
        expect(result).not.toBeNull();
        // expect(result.constructor.name).toBe('BlockUI'); // fails if minified
        expect(result.state().id).toBe('myId');
        expect(instances.myId).toBe(result);

      });

      it('should re-use existing instances', function() {

        var instances = blockUI.instances;
        var result1 = instances.get('myId');
        var result2 = instances.get('myId');

        expect(result2).toBe(result1);

      });

    });

    describe('release', function() {

      it('should _destroy the instance when there are no more references', function() {

        spyOn(blockUI.instances, '_destroy').andCallThrough();

        var removeMe = blockUI.instances.get('removeMe');
        
        removeMe.addRef(); // 1
        removeMe.addRef(); // 2

        removeMe.release(); // 1
        removeMe.release(); // 0

        expect(blockUI.instances.removeMe).toBeUndefined();
        expect(blockUI.instances._destroy).toHaveBeenCalled();
      });

      it('should not _destroy the instance when there are references', function() {

        spyOn(blockUI.instances, '_destroy').andCallThrough();

        var removeMe = blockUI.instances.get('removeMe');

        removeMe.addRef();
        removeMe.addRef(); // 2 references

        removeMe.release(); // 1

        expect(blockUI.instances.removeMe).toBeDefined();
        expect(blockUI.instances._destroy).not.toHaveBeenCalled();
      });

    });

    describe('_destroy', function() {

      beforeEach(function() {
        blockUI.instances.get('removeMe');
      });

      it('should remove instance by id', function() {

        expect(blockUI.instances.removeMe).toBeDefined();

        blockUI.instances._destroy('removeMe');

        expect(blockUI.instances.removeMe).toBeUndefined();

      });

      it('should remove instance by instance', function() {

        expect(blockUI.instances.removeMe).toBeDefined();

        blockUI.instances._destroy(blockUI.instances.removeMe);

        expect(blockUI.instances.removeMe).toBeUndefined();

      });

      it('should call reset on the removed instance', function() {

        var instance = blockUI.instances.removeMe;

        expect(instance).toBeDefined();

        spyOn(instance, 'reset');

        blockUI.instances._destroy(instance);

        expect(instance.reset).toHaveBeenCalled();

      });

    }); // remove

    describe('locate', function() {

      it('should return the main blockUI', function() {

        var result = blockUI.instances.locate({
          url: '/api/quotes/123'
        });

        expect(result.length).toBe(1);
        expect(result[0]).toBe(blockUI);

      });

      it('should return the blockUI with the matching pattern', function() {

        var myInstance = blockUI.instances.get('myInstance');
        myInstance.pattern(/^\/api\/quotes\/123/);

        var result = blockUI.instances.locate({
          url: '/api/quotes/123'
        });

        expect(result.length).toBe(1);
        expect(result[0]).toBe(myInstance);

      });

      it('should return multiple blockUI that match the pattern', function() {

        var myInstance1 = blockUI.instances.get('myInstance1');
        var myInstance2 = blockUI.instances.get('myInstance2');

        myInstance1.pattern(/^\/api\/quotes\/\d+/);
        myInstance2.pattern(/^\/api\/quotes\/123/);

        var result = blockUI.instances.locate({
          url: '/api/quotes/123'
        });

        expect(result.length).toBe(2);

        expect(result.indexOf(myInstance1)).not.toBe(-1);
        expect(result.indexOf(myInstance2)).not.toBe(-1);

      });

      it('should return the main blockUI if none match the pattern', function() {

        var myInstance1 = blockUI.instances.get('myInstance1');
        var myInstance2 = blockUI.instances.get('myInstance2');

        myInstance1.pattern(/^\/api\/quotes\/\d+/);
        myInstance2.pattern(/^\/api\/quotes\/123/);

        var result = blockUI.instances.locate({
          url: '/api/users/123'
        });

        expect(result.length).toBe(1);
        expect(result[0]).toBe(blockUI);

      });
    });

  }); // instances

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

      expect(blockUI.reset).toHaveBeenCalledWith(true /* executeCallbacks */ );

    });

  }); // stop
});
