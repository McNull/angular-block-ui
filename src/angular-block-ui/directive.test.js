describe('block-ui-directive', function() {

  var $scope, $compile, $document, $body, blockUI, $timeout;

  beforeEach(function() {

    module('blockUI');

    inject(function(_$rootScope_, _$compile_, _$document_, _blockUI_, _$timeout_) {

      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $document = _$document_;
      $timeout = _$timeout_;
      
      $body = $document.find('body');
      
      blockUI = _blockUI_;
      
      $document.find('div').remove();
    });

  });

  afterEach(function() {
    $document.find('div').remove();
  });

  describe('template', function() {

    var $ = angular.element;
    var instanceName = 'templateTest';
    var blockInstance;
    var markup = '<div block-ui="' + instanceName + '"></div>';

    beforeEach(function() {
      blockInstance = blockUI.instances.get('templateTest');
    });

    afterEach(function() {
      blockUI.instances._destroy(blockInstance);
      blockInstance = null;
    });

    it('should compile the template', function() {

      var $element = $compile(markup)($scope);
      $scope.$digest();

      var $innerDiv = $($element.children()[0]);

      expect($innerDiv.hasClass('block-ui-overlay')).toBe(true);
    });

    it('should have an associate block state', function() {

      var $element = $compile(markup)($scope);
      $scope.$digest();

      var state = blockUI.instances.get(instanceName);
      expect(state).toBeDefined();
      expect(state).toEqual(blockInstance);

    });

    describe('aria attributes', function() {
      it('should set aria-busy to true on parent element when blocking', function() {

        var $element = $compile('<div>' + markup + '</div>')($scope);
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('false');

        blockInstance.start(); 
        $timeout.flush(); // skip the delay of the block
        $scope.$digest();

        expect($element.attr('aria-busy')).toBe('true');
      });
    });

  });

  describe('link', function() {

    var linkFn, $attrs; 

    beforeEach(function() {

      $attrs = {};

      inject(function(blockUiLinkFn) {
        linkFn = blockUiLinkFn;
      });

    });

    describe('element', function() {

      it('should set the block-ui class on the element', function() {

        // arrange

        var $element = angular.element('<div><div></div></div>').find('div');

        // act

        linkFn($scope, $element, $attrs);

        // assert

        expect($element.hasClass('block-ui')).toBe(true);

      });

      it('should set the parent position to relative', function() {

        // arrange

        var $element = angular.element('<div><div></div></div>').find('div');

        // act

        linkFn($scope, $element, $attrs);

        // assert

        expect($element.parent().css('position')).toBe('relative');

      });

      it('should not set the parent body element position to relative', function() {

        // arrange

        var $element = angular.element('<div></div>');
        $body.append($element);

        // act

        linkFn($scope, $element, $attrs);

        // assert

        expect($element.parent().css('position')).not.toBe('relative');

      });

      it('should set the block-ui data of the parent element to the service instance', function() {

        // arrange

        var $parent = angular.element('<div><div></div></div>')
        var $element = $parent.find('div');
        
        var instanceId = "myInstance";
        var myInstance = blockUI.instances.get(instanceId);
        $attrs.blockUi = instanceId;

        // act
        
        linkFn($scope, $element, $attrs);

        // assert

        expect($parent.data('block-ui')).toBe(myInstance);

      });

      it('should set the _parent property of the instance to the parent instance', function() {

        // arrange

        var $parent = angular.element('<div></div>')
        var parentInstance = blockUI.instances.get('parentInstance');
        $parent.data('block-ui', parentInstance);

        // Outer diff is the block scope
        var $child = angular.element('<div><div></div><div>');
        $parent.append($child);

        var $target = $child.find('div');

        var childInstanceId = "childInstance";
        var childInstance = blockUI.instances.get(childInstanceId);
        $attrs.blockUi = childInstanceId;

        // act
        
        linkFn($scope, $target, $attrs);

        // assert

        expect(childInstance._parent).toBe(parentInstance);

      });

    }); // element

    describe('viewContentLoaded', function() {

      describe('when not directly under the body element', function() {
        
        it('should not listen', function() {

          // arrange

          var $element = angular.element('<div><div></div></div>').find('div');
          spyOn($scope, '$on');

          // act

          linkFn($scope, $element, $attrs);

          // assert

          expect($scope.$on).not.toHaveBeenCalledWith('$viewContentLoaded');
        });

      });
      
      describe('when directly under the body element', function() {
        
        it('should listen', function() {

          // arrange

          var $element = angular.element('<div></div>');
          $body.append($element);

          spyOn($scope, '$on');

          // act

          linkFn($scope, $element, $attrs);

          // assert

          expect($scope.$on).toHaveBeenCalled();
        });

      });
      
    }); // viewContentLoaded
    
    describe('block-ui id', function() {

      it('should create a blockUI instance by ID', function() {

        var $attrs = {
          blockUi: 'myInstance'
        }; 

        var $element = angular.element('<div><div block-ui="myInstance"></div></div>').find('div');

        linkFn($scope, $element, $attrs);
 
        expect(blockUI.instances.myInstance).toBeDefined();
        
      });

      it('should re-use the same blockUI instance with the same id', function() {
        
        var $attrs = {
          blockUi: 'myInstance'
        };

        var myInstance = blockUI.instances.get($attrs.blockUi);

        var $element = angular.element('<div><div block-ui="myInstance"></div></div>').find('div');

        linkFn($scope, $element, $attrs);

        expect(blockUI.instances.myInstance).toBe(myInstance);

      });

      it('should use scope id when no id is provided', function() {

        // Prefix underscore to prevent integers:
        // https://github.com/McNull/angular-block-ui/pull/8

        var expectedId = '_' + $scope.$id; 

        var $attrs = {}; 

        var $element = angular.element('<div><div></div></div>').find('div');

        linkFn($scope, $element, $attrs);
 
        expect(blockUI.instances[expectedId]).toBeDefined();
      });

    }); // nested block-ui
    
    describe('scope state', function() {
      
      it('should expose main state on sub body element', function() {
        
        var $element = angular.element('<div></div>');
        $body.append($element);
        
        linkFn($scope, $element, $attrs);
        
        expect($scope.state).toBe(blockUI.state());
        
      });
      
      it('should expose instance state on nested element', function() {
        
        var $element = angular.element('<div><div></div></div>').find('div');
        
        linkFn($scope, $element, { blockUi: 'myInstance' });
        
        expect($scope.state).toBe(blockUI.instances.myInstance.state());
        
      });
      
    });
    
    describe('scope destroy', function() {
      
      it('should release the instance when the scope is destroyed', function() {
        
        var $element = angular.element('<div><div></div></div>').find('div');
        
        linkFn($scope, $element, { blockUi: 'myInstance' });
        
        var instance = blockUI.instances.myInstance;
        
        spyOn(instance, 'release').andCallThrough();
        spyOn(blockUI.instances, '_destroy');
        
        $scope.$destroy();
        
        expect(instance.release).toHaveBeenCalled();
        expect(blockUI.instances._destroy).toHaveBeenCalledWith(instance);
        
      });
      
    });
    
    describe('pattern', function() {

      it('should create regexp instance', function() {

        var $element = angular.element('<div><div></div></div>').find('div');
        var pattern = '^\/api\/quote($|\/).*';

        linkFn($scope, $element, { blockUi: 'myInstance', blockUiPattern: '/' + pattern + '/' });

        var instance = blockUI.instances.myInstance;

        expect(instance.pattern()).toBeDefined();
        expect(instance.pattern().source).toBe(pattern);
        
      });

    });

  }); // link
});
