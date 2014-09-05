describe('block-ui-service', function() {

  var blockUI, $document, blockUIConfig;

  beforeEach(function() {

    module('blockUI');

    beforeEach(function() {
      // $document = angular.element('<html><head></head><body></body></html>');

      // console.log($document[0]);
      // module(function($provide) {
      //   $provide.value('$document', $document);
      // });
    });

    inject(function(_blockUI_, _$document_, $rootScope, _blockUIConfig_) {
      blockUI = _blockUI_;
      $document = _$document_;
      blockUIConfig = _blockUIConfig_;
//      $rootScope.$apply();
    });

    afterEach(function() {
      $document.find('body').empty();
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

    describe('get', function() {

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

      it('should not allow numeric instance ids', function() {

        var idString = '123', idInt = 123;
        var idStringException, idIntException;

        try {
          blockUI.instances.get(idString);
        } catch(ex) {
          idStringException = ex;
        }

        try {
          blockUI.instances.get(idInt);
        } catch(ex) {
          idIntException = ex;
        }

        expect(idStringException).toBeDefined();
        expect(idIntException).toBeDefined();

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
        blockUI.instances.length = 0;
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

        expect(blockUI.instances.length).toBe(1);

        blockUI.instances._destroy(blockUI.instances.removeMe);

        expect(blockUI.instances.length).toBe(0);

      });

      it('should remove instance from the instance array', function() {

        expect(blockUI.instances.length).toBe(1);

        blockUI.instances._destroy(blockUI.instances.removeMe);

        expect(blockUI.instances.length).toBe(0);

      });

      it('should remove instance from the instance array (2)', function() {

        blockUI.instances.get('anotherOne');
        blockUI.instances.get('andAnotherOne');

        expect(blockUI.instances.length).toBe(3);

        blockUI.instances._destroy(blockUI.instances.removeMe);

        expect(blockUI.instances.length).toBe(2);

      });


//      it('should remove the instance from the instance array', function() {
//
//        var instance = blockUI.instances.removeMe;
//
//        expect(instance).toBeDefined();
//
//        spyOn(instance, 'reset');
//
//        blockUI.instances._destroy(instance);
//
//        expect(instance.reset).toHaveBeenCalled();
//
//      });



    }); // _destroy

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

    it('should copy the default config message to the state if none is provided', function() {

      var state = blockUI.state();

      blockUI.start();

      expect(state.message).toBe(blockUIConfig.message);

    });

    it('should copy the provided message to the state', function() {

      var customMessage = "My custom message ...";
      var state = blockUI.state();

      blockUI.start(customMessage);

      expect(state.message).toBe(customMessage);

    });

    it('should override the state message with the provided message', function() {

      var customMessage = "My custom message ...";
      var state = blockUI.state();

      blockUI.start();
      blockUI.start(customMessage);

      expect(state.message).toBe(customMessage);

    });

    it('should not revert back to default config message on active block if no message is provided', function() {

      var customMessage = "My custom message ...";
      var state = blockUI.state();

      blockUI.start(customMessage);
      blockUI.start();

      expect(state.message).toBe(customMessage);

    });

    it('should revert back to default config message after block has been stopped', function() {

      var customMessage = "My custom message ...";
      var state = blockUI.state();

      blockUI.start(customMessage);
      blockUI.stop();

      blockUI.start();

      expect(state.message).toBe(blockUIConfig.message);

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

  describe('focus management', function() {

    var $body, $timeout;

    beforeEach(function() {
      $body = $document.find('body');
      $body.data('block-ui', blockUI);

      inject(function(_$timeout_) {
        $timeout = _$timeout_;
      })
    });

    it('should blur the focussed element if it is within the main block scope', function() {

      var $input = angular.element('<input/>');
      $body.append($input);
      $input[0].focus();

      expect($document[0].activeElement).toBe($input[0]);

      blockUI.start();
      $timeout.flush();

      expect($document[0].activeElement).not.toBe($input[0]);
    });

    it('should blur the focussed element if it is a child of the main block scope', function() {

      // Create an instance with the _parent property set to the main block

      var myInstance = blockUI.instances.get('myInstance');
      myInstance._parent = blockUI;

      var $block = angular.element('<div><input/></div>');
      var $input = $block.find('input');
      
      $body.append($block);
      $input[0].focus();

      $block.data('block-ui', myInstance);

      expect($document[0].activeElement).toBe($input[0]);

      blockUI.start();
      $timeout.flush();

      expect($document[0].activeElement).not.toBe($input[0]);

    });

    it('should blur the focussed element if it is within a block scope', function() {

      // Create an instance with the _parent property set to the main block

      var myInstance = blockUI.instances.get('myInstance');
      myInstance._parent = blockUI;

      var $block = angular.element('<div><input/></div>');
      var $input = $block.find('input');
      
      $body.append($block);
      $input[0].focus();

      $block.data('block-ui', myInstance);

      expect($document[0].activeElement).toBe($input[0]);

      myInstance.start();
      $timeout.flush();

      expect($document[0].activeElement).not.toBe($input[0]);
    });

    it('should NOT blur the focussed element if it is NOT within a block scope', function() {

      // Create an instance with the _parent property set to the main block

      var myInstance = blockUI.instances.get('myInstance');
      myInstance._parent = blockUI;

      var $block = angular.element('<div></div>');
      var $input = angular.element('<input/>');
      
      $body.append($block);
      $body.append($input);

      $input[0].focus();

      $block.data('block-ui', myInstance);

      expect($document[0].activeElement).toBe($input[0]);

      myInstance.start();
      $timeout.flush();

      expect($document[0].activeElement).toBe($input[0]);
    });

    it('should restore focus when the main block has finished', function() {

      var $input = angular.element('<input/>');
      $body.append($input);
      $input[0].focus();

      expect($document[0].activeElement).toBe($input[0]);
      
      blockUI.start();
      $timeout.flush();

      expect($document[0].activeElement).not.toBe($input[0]);

      blockUI.stop();

      expect($document[0].activeElement).toBe($input[0]);
    });

    it('should restore focus when the child block has finished', function() {

      // Create an instance with the _parent property set to the main block

      var myInstance = blockUI.instances.get('myInstance');
      myInstance._parent = blockUI;

      var $block = angular.element('<div><input/></div>');
      var $input = $block.find('input');
      
      $body.append($block);
      $input[0].focus();

      $block.data('block-ui', myInstance);

      $input[0].focus();

      expect($document[0].activeElement).toBe($input[0]);
      
      myInstance.start();
      $timeout.flush();
      
      expect($document[0].activeElement).not.toBe($input[0]);

      myInstance.stop();

      expect($document[0].activeElement).toBe($input[0]);

    });

    it('should NOT restore focus when the focus has changed', function() {

      // Create an instance with the _parent property set to the main block

      var myInstance = blockUI.instances.get('myInstance');
      myInstance._parent = blockUI;

      var $block = angular.element('<div><input/></div>');
      $block.data('block-ui', myInstance);

      var $input = $block.find('input');
      
      $body.append($block);

      var $otherInput = angular.element('<input/>');
      $body.append($otherInput);

      // Set the focus on the contained element

      $input[0].focus();
      
      // Start the block

      myInstance.start(); 
      
      // Set the focus to the other element

      $otherInput[0].focus();

      // Stop the block

      myInstance.stop();

      expect($document[0].activeElement).not.toBe($input[0]);
      expect($document[0].activeElement).toBe($otherInput[0]);

    });

  }); // focus management
});
