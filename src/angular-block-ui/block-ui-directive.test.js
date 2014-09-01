describe('block-ui-directive', function () {

  var $ = angular.element, $attrs = {}, $compile, $scope, blockUI, $timeout, config, configCopy, linkFn, compileFn;

  beforeEach(function () {
    module('blockUI');

    inject(function (_blockUI_, _$timeout_, _$rootScope_, _$compile_, blockUIConfig, blockUiLinkFn, blockUiCompileFn) {

      blockUI = _blockUI_;
      $timeout = _$timeout_;
      $compile = _$compile_;
      $scope = _$rootScope_.$new();
      config = blockUIConfig;
      linkFn = blockUiLinkFn;
      compileFn = blockUiCompileFn;

    });

    configCopy = angular.copy(config, configCopy);
  });

  afterEach(function () {
    // Reset the config back to its original settings
    config = angular.copy(configCopy, config);
  });

  describe('compile', function () {

    it('should append block-ui-container element', function () {

      var $element = $('<div></div>');

      compileFn($element, $attrs);

      var child = $element.children()[0];

      expect(child.attributes['block-ui-container']).toBeDefined();
    });

//    it('should compile the directive', function() {
//
//      var $element = $('<div block-ui></div>');
//
//      //////////////////////////////////////////////////////////////////
//      // TODO
//      //////////////////////////////////////////////////////////////////
//
//    });

  });

  describe('link', function () {

//    it('should add the block-ui class to the element', function() {
//
//      var $element = $('<div></div>');
//
//      linkFn($scope, $element, $attrs);
//
//      var result = $element.hasClass('block-ui');
//
//      expect(result).toBeTruthy();
//
//    });

    describe('cssClass', function () {

      it('should set the css classes defined in the config', function () {

        var classes = ['first-class', 'second-class'];
        config.cssClass = classes.join(' ');
        var $element = $('<div></div>');
        linkFn($scope, $element, $attrs);

        expect($element.hasClass(classes[0])).toBe(true);
        expect($element.hasClass(classes[1])).toBe(true);

      });

      it('should not addd the css classes if the element has the class "block-ui" set.', function () {

        var classes = ['first-class', 'second-class'];
        config.cssClass = classes.join(' ');
        var $element = $('<div class="block-ui"></div>');
        linkFn($scope, $element, $attrs);

        expect($element.hasClass('block-ui')).toBe(true);
        expect($element.hasClass(classes[0])).toBe(false);
        expect($element.hasClass(classes[1])).toBe(false);

      });
    });

    describe('message css class data', function() {

      it('should store the value of the attribute "block-ui-message-class"', function() {
        var $element = $('<div></div>');

        $attrs.blockUiMessageClass = 'my-message-class';
        linkFn($scope, $element, $attrs);

        expect($element.data('block-ui-message-class')).toBe('my-message-class');
      });
    });

//    describe('animation', function() {
//
//      it('should set the configured animation class on the element', function() {
//        config.animation = 'my-animation';
//
//        var className = 'block-ui-anim-' + config.animation;
//
//        var $element = $('<div></div>');
//
//        linkFn($scope, $element, $attrs);
//
//        var result = $element.hasClass(className);
//
//        expect(result).toBe(true);
//      });
//
//      it('should set the animation class on the element provided by attribute value', function() {
//
//        $attrs.blockUiAnimation = 'the-animation';
//        var className = 'block-ui-anim-' + $attrs.blockUiAnimation;
//
//        var $element = $('<div></div>');
//
//        linkFn($scope, $element, $attrs);
//
//        var result = $element.hasClass(className);
//
//        expect(result).toBe(true);
//      });
//
//    });

    describe('block-ui service instance', function () {

      it('should create set the service instance as data on the element', function () {

        var $element = $('<div></div>');

        linkFn($scope, $element, $attrs);

        var result = $element.data('block-ui');

        expect(result).toBeDefined();

      });

      it('should use scope id when no id is provided', function () {

        // Prefix underscore to prevent integers:
        // https://github.com/McNull/angular-block-ui/pull/8

        var expectedId = '_' + $scope.$id;

        var $attrs = {};

        var $element = $('<div></div>');

        linkFn($scope, $element, $attrs);

        expect(blockUI.instances[expectedId]).toBeDefined();
      });

      it('should use the provided service instance', function () {

        var $element = $('<div></div>');

        $attrs.blockUi = 'testInstance';
        linkFn($scope, $element, $attrs);

        var expected = blockUI.instances.get('testInstance');
        var result = $element.data('block-ui');

        expect(result).toBeDefined();
        expect(result).toBe(expected);

      });

    }); // block-ui service instance

    describe('parent block-ui service', function () {

      it('should set the _parent property of the instance to the parent instance', function () {

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

        linkFn($scope, $element, $attrs);

        // assert

        expect(childInstance._parent).toBe(parentInstance);

      });

    }); // parent block-ui service

    describe('service reference count', function () {

      var instanceName = 'myInstance';
      var instance;

      beforeEach(function () {
        instance = blockUI.instances.get(instanceName);
      });

      afterEach(function () {
        blockUI.instances._destroy(instance);
      });

      it('should increase the reference count of the service', function () {

        expect(instance._refs).toBe(0);

        var $element = $('<div></div>');

        linkFn($scope, $element, { blockUi: instanceName });

        expect(instance._refs).toBe(1);

      });

      it('should release the instance when the scope is destroyed', function () {

        var $element = $('<div></div>');

        linkFn($scope, $element, { blockUi: instanceName });

        spyOn(instance, 'release').andCallThrough();
        spyOn(blockUI.instances, '_destroy');

        $scope.$destroy();

        expect(instance.release).toHaveBeenCalled();
        expect(blockUI.instances._destroy).toHaveBeenCalledWith(instance);

      });


    }); // service reference count

    describe('pattern', function () {

      it('should create regexp instance', function () {

        var $element = $('<div></div>');
        var pattern = '^\/api\/quote($|\/).*';

        linkFn($scope, $element, { blockUi: 'myInstance', blockUiPattern: '/' + pattern + '/' });

        var instance = blockUI.instances.myInstance;

        expect(instance.pattern()).toBeDefined();
        expect(instance.pattern().source).toBe(pattern);

      });

    }); // pattern

    describe('aria attributes', function () {
      it('should set aria-busy to true when blocking', function () {

        var blockInstance = blockUI.instances.get('myInstance');
        var $element = $('<div></div>');
        linkFn($scope, $element, { blockUi: 'myInstance' });

        blockInstance.start();
        $timeout.flush(); // skip the delay of the block
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('true');

        blockInstance.stop();
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('false');
      });
    });

  }); // link

});