describe('block-ui-directive', function() {

  var $ = angular.element, $attrs = {
    $observe: function(key, cb) {
      $scope.$watch(function() {
        return $attrs[key];
      }, function(value) {
        cb(value);
      });

    }
  }, $compile, $scope, blockUI, $timeout, config, configCopy, preLinkFn, postLinkFn, compileFn;

  beforeEach(function() {
    module('blockUI');

    inject(function(_blockUI_, _$timeout_, _$rootScope_, _$compile_, blockUIConfig, blockUiPreLinkFn, /*blockUiPostLinkFn,*/ blockUiCompileFn) {

      blockUI = _blockUI_;
      $timeout = _$timeout_;
      $compile = _$compile_;
      $scope = _$rootScope_.$new();
      config = blockUIConfig;
      preLinkFn = blockUiPreLinkFn;
//      postLinkFn = blockUiPostLinkFn;
      compileFn = blockUiCompileFn;

    });

    configCopy = angular.copy(config, configCopy);
  });

  afterEach(function() {
    // Reset the config back to its original settings
    config = angular.copy(configCopy, config);
  });

  describe('compile', function() {

    it('should append block-ui-container element', function() {

      var $element = $('<div></div>');

      compileFn($element, $attrs);

      var child = $element.children()[0];

      expect(child.attributes['block-ui-container']).toBeDefined();
    });

    it('should compile the directive', function() {

      var $element = $('<div block-ui></div>');

      //////////////////////////////////////////////////////////////////
      // TODO
      //////////////////////////////////////////////////////////////////

    });

  });

  describe('pre-link', function() {

    describe('element css class', function() {

      it('should apply the default classes from the config', function() {

        var $element = $('<div></div>');
        config.cssClass = 'my-first-class my-second-class';

        preLinkFn($scope, $element, $attrs);

        var result = $element.hasClass(config.cssClass);

        expect(result).toBeTruthy();

      });

      it('should noy apply the default classes from the config if block-ui class already set', function() {

        var $element = $('<div class="block-ui my-other-class"></div>');
        config.cssClass = 'my-first-class my-second-class';

        preLinkFn($scope, $element, $attrs);

        var result = $element.hasClass(config.cssClass);

        expect(result).toBeFalsy();

      });

    });


    describe('block-ui service instance', function() {

      it('should create set the service instance as data on the element', function() {

        var $element = $('<div></div>');

        preLinkFn($scope, $element, $attrs);

        var result = $element.data('block-ui');

        expect(result).toBeDefined();

      });

      it('should use scope id when no id is provided', function() {

        // Prefix underscore to prevent integers:
        // https://github.com/McNull/angular-block-ui/pull/8

        var expectedId = '_' + $scope.$id;

        var $element = $('<div></div>');

        preLinkFn($scope, $element, $attrs);

        expect(blockUI.instances[expectedId]).toBeDefined();
      });

      it('should use the provided service instance', function() {

        var $element = $('<div></div>');

        $attrs.blockUi = 'testInstance';
        preLinkFn($scope, $element, $attrs);

        var expected = blockUI.instances.get('testInstance');
        var result = $element.data('block-ui');

        expect(result).toBeDefined();
        expect(result).toBe(expected);

      });

    }); // block-ui service instance

    describe('parent block-ui service', function() {

      it('should set the _parent property of the instance to the parent instance', function() {

        // arrange

        var $parent = $('<div></div>')
        var parentInstance = blockUI.instances.get('parentInstance');
        $parent.data('block-ui', parentInstance);

        var $element = angular.element('<div><div>');
        $parent.append($element);

        var childInstanceId = "childInstance";
        var childInstance = blockUI.instances.get(childInstanceId);
        $attrs.blockUi = childInstanceId;

        // act

        preLinkFn($scope, $element, $attrs);

        // assert

        expect(childInstance._parent).toBe(parentInstance);

      });

    }); // parent block-ui service

    describe('service reference count', function() {

      var instanceName = 'myInstance';
      var instance;

      beforeEach(function() {
        instance = blockUI.instances.get(instanceName);
      });

      afterEach(function() {
        blockUI.instances._destroy(instance);
      });

      it('should increase the reference count of the service', function() {

        expect(instance._refs).toBe(0);

        var $element = $('<div></div>');
        $attrs.blockUi = instanceName;

        preLinkFn($scope, $element, $attrs);

        expect(instance._refs).toBe(1);

      });

      it('should release the instance when the scope is destroyed', function() {

        var $element = $('<div></div>');
        $attrs.blockUi = instanceName;

        preLinkFn($scope, $element, $attrs);

        spyOn(instance, 'release').andCallThrough();
        spyOn(blockUI.instances, '_destroy');

        $scope.$destroy();

        expect(instance.release).toHaveBeenCalled();
        expect(blockUI.instances._destroy).toHaveBeenCalledWith(instance);

      });


    }); // service reference count

    describe('pattern', function() {

      it('should create regexp instance', function() {

        var $element = $('<div></div>');
        var pattern = '^\/api\/quote($|\/).*';

        $attrs.blockUi = 'myInstance';
        $attrs.blockUiPattern = '/' + pattern + '/';

        preLinkFn($scope, $element, $attrs);

        var instance = blockUI.instances.myInstance;

        expect(instance.pattern()).toBeDefined();
        expect(instance.pattern().source).toBe(pattern);

      });

    }); // pattern


    describe('block-ui-message-class', function() {

      it('should expose the block-ui-message-class attribute value on the scope', function() {

        var $element = $('<div></div>');
        $attrs.blockUiMessageClass = 'my-class';

        preLinkFn($scope, $element, $attrs);
        $scope.$digest();

        expect($scope.$_blockUiMessageClass).toBe($attrs.blockUiMessageClass);

      });

      it('should observe the block-ui-message-class attribute value', function() {

        var $element = $('<div></div>');

        preLinkFn($scope, $element, $attrs);
        $scope.$digest();

        $attrs.blockUiMessageClass = 'my-class';
        $scope.$digest();

        expect($scope.$_blockUiMessageClass).toBe($attrs.blockUiMessageClass);

      });

    });

    describe('block ui state', function() {

      it('should expose the state on the scope', function() {

        var $element = $('<div></div>');
        var instance = blockUI.instances.get('my-instance');
        var state = instance.state();

        $attrs.blockUi = 'my-instance';

        preLinkFn($scope, $element, $attrs);

        expect($scope.$_blockUiState).toBe(state);

      });

      it('should set aria-busy to true when block is visible', function() {

        var blockInstance = blockUI.instances.get('myInstance');
        var $element = $('<div></div>');
        $attrs.blockUi = 'myInstance';

        preLinkFn($scope, $element, $attrs);

        blockInstance.start();
        $timeout.flush(); // skip the delay of the block
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('true');

        blockInstance.stop();
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('false');
      });

      it('should set block-ui-visible class when block is visible', function() {

        var blockInstance = blockUI.instances.get('myInstance');
        var $element = $('<div></div>');
        $attrs.blockUi = 'myInstance';

        preLinkFn($scope, $element, $attrs);

        blockInstance.start();
        $timeout.flush(); // skip the delay of the block
        $scope.$digest();

        expect($element.hasClass('block-ui-visible')).toBe(true);

        blockInstance.stop();
        $scope.$digest();

        expect($element.hasClass('block-ui-visible')).toBe(false);

      });

      it('should set block-ui-active class when blocking', function() {

        var blockInstance = blockUI.instances.get('myInstance');
        var $element = $('<div></div>');
        $attrs.blockUi = 'myInstance';

        preLinkFn($scope, $element, $attrs);

        blockInstance.start();
        $scope.$digest();

        expect($element.hasClass('block-ui-active')).toBe(true);

        blockInstance.stop();
        $scope.$digest();

        expect($element.hasClass('block-ui-active')).toBe(false);

      });
    });

  }); // pre-link

//  describe('post-link', function() {
//
//    describe('block-ui-message-class', function() {
//
//      it('should add css classes to the .block-ui-message element', function() {
//
//        // Arrange
//
//        //  <div block-ui>
//        //    <div class="block-ui-message"></div>
//        //  </div>
//
//        var messageClass = 'my-message-class';
//        var $blockUi = $('<div block-ui></div>');
//        var $message = $('<div class="block-ui-message"></div>');
//
//        $blockUi.append($message);
//
//        $attrs.blockUiMessageClass = messageClass;
//
//        // Act
//
//        postLinkFn($scope, $blockUi, $attrs);
//        $scope.$digest();
//
//        // Assert
//
//        expect($message.hasClass(messageClass)).toBe(true);
//
//      });
//
//      it('should add css classes to the correct .block-ui-message element', function() {
//
//        // Arrange
//
//        //  <div block-ui>
//        //    <div class="block-ui-message"></div>
//        //  </div>
//
//        var messageClass = 'my-message-class';
//        var $blockUi = $('<div block-ui></div>');
//        var $message = $('<div class="block-ui-message"></div>');
//
//        $blockUi.append($message);
//
//        $attrs.blockUiMessageClass = messageClass;
//
//        // Act
//
//        postLinkFn($scope, $blockUi, $attrs);
//        $scope.$digest();
//
//        // Assert
//
//        expect($message.hasClass(messageClass)).toBe(true);
//
//      });
//    });
//
//
//  });
});