describe('block-ui-container-directive', function() {

  var $scope, $ = angular.element, $parent, blockInstanceId = "theInstance",
    blockInstance, blockUI, $attrs = {}, $compile, $timeout;

  beforeEach(function() {

    module('blockUI');

    inject(function(_$rootScope_, _blockUI_, _$compile_, _$timeout_) {

      $scope = _$rootScope_.$new();
      blockUI = _blockUI_;
      $compile = _$compile_;
      $timeout = _$timeout_;

    });

    blockInstance = blockUI.instances.get(blockInstanceId);

    $parent = $('<div></div>');
    $parent.data('block-ui', blockInstance);

  });

  afterEach(function() {
    blockUI.instances._destroy(blockInstance);
  });

  describe('template', function() {

    var $element;

    beforeEach(function() {

      $element = $('<div block-ui-container></div>');
      $parent.append($element);

    });

    it('should compile the directive', function() {

      $element = $compile($element)($scope);
      $scope.$digest();

      var $children = $element.children();

      expect($children.length).toBe(2);

      var $overlay = $($children[0]);
      var $message = $($children[1]);

//      expect($element.hasClass('block-ui-container')).toBe(true); // done by blockUi directive
      expect($overlay.hasClass('block-ui-overlay')).toBe(true);
      expect($message.hasClass('block-ui-message-container')).toBe(true);

    });

  });

  describe('link', function() {

    var linkFn, $element;

    beforeEach(function() {
      inject(function(blockUiContainerLinkFn) {
        linkFn = blockUiContainerLinkFn;
      });

      $element = $('<div></div>');
      $parent.append($element);
    });

    it('should expose the blockstate on the scope', function() {

      linkFn($scope, $element, $attrs);

      expect($scope.state).toBeDefined();
      expect($scope.state).toBe(blockInstance.state());

    });

//    it('should set the block-ui-container class', function() {
//
//      linkFn($scope, $element, $attrs);
//
//      expect($element.hasClass('block-ui-container')).toBe(true);
//
//    });

//    it('should set the block-ui-visible class when in blocking state', function() {
//
//      linkFn($scope, $element, $attrs);
//      expect($element.hasClass('block-ui-visible')).toBe(false);
//
//      blockInstance.start();
//      $timeout.flush();
//      $scope.$digest();
//
//      expect($element.hasClass('block-ui-visible')).toBe(true);
//
//      blockInstance.stop();
//      $scope.$digest();
//
//      expect($element.hasClass('block-ui-visible')).toBe(false);
//    });
//
//    it('should set the block-ui-active class when blockcount > 0', function() {
//
//      linkFn($scope, $element, $attrs);
//      expect($element.hasClass('block-ui-active')).toBe(false);
//
//      blockInstance.start();
//      $scope.$digest();
//
//      expect($element.hasClass('block-ui-active')).toBe(true);
//
//      blockInstance.stop();
//      $scope.$digest();
//
//      expect($element.hasClass('block-ui-active')).toBe(false);
//    });

  });
});
