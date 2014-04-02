describe('block-ui-directive', function() {

  var $scope, $compile, $document, $body, blockUI;

  beforeEach(function() {

    module('blockUI');

    inject(function(_$rootScope_, _$compile_, _$document_, _blockUI_) {

      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $document = _$document_;
      $body = $document.find('body');
      
      blockUI = _blockUI_;
      
      $document.find('div').remove();
    });

  });

  afterEach(function() {
    $document.find('div').remove();
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

    }); // element

    describe('viewContentLoaded', function() {

      describe('when not directly under the body element', function() {
        
        it('should not listen', function() {

          // arrange

          var $element = angular.element('<div><div></div></div').find('div');
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
    
    describe('nested block-ui', function() {

      it('should create a blockUI instance by ID', function() {

        var $attrs = {
          id: 'myInstance'
        }; 

        var $element = angular.element('<div><div block-ui id="myInstance"></div></div>').find('div');

        linkFn($scope, $element, $attrs);
 
        expect(blockUI.instances.myInstance).toBeDefined();
        
      });

      it('should use scope id when no id is provided', function() {

        var $attrs = {}; 

        var $element = angular.element('<div><div></div></div>').find('div');

        linkFn($scope, $element, $attrs);
 
        expect(blockUI.instances[$scope.$id]).toBeDefined();
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
        
        linkFn($scope, $element, { id: 'myInstance' });
        
        expect($scope.state).toBe(blockUI.instances.myInstance.state());
        
      });
      
    });
    
    describe('scope destroy', function() {
      
      it('should remove the instance when the scope is destroyed', function() {
        
        var $element = angular.element('<div><div></div></div>').find('div');
        
        linkFn($scope, $element, { id: 'myInstance' });
        
        var instance = blockUI.instances.myInstance;
        
        spyOn(blockUI.instances, 'remove');
        
        $scope.$destroy();
         
        expect(blockUI.instances.remove).toHaveBeenCalledWith(instance);
        
      });
      
    });
    
    describe('pattern', function() {

      it('should create regexp instance', function() {

        var $element = angular.element('<div><div></div></div>').find('div');
        var pattern = '^\/api\/quote($|\/).*';

        linkFn($scope, $element, { id: 'myInstance', blockUiPattern: '/' + pattern + '/' });

        var instance = blockUI.instances.myInstance;

        expect(instance.pattern()).toBeDefined();
        expect(instance.pattern().source).toBe(pattern);
        
      });

    });

  }); // link
});
