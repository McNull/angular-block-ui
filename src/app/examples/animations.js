angular.module('myApp').controller('AnimationsExampleController', function($scope, $timeout, blockUI) {
    var block = blockUI.instances.get('blockUIAnimated');

  $scope.toggleBlock = function () {
    block.isBlocking() ? block.stop() : block.start();
  };

  $scope.toggleBlock();

  $scope.model = {
    animate: true,
    startEndAnimations: [
      'block-ui-animate-scale',
      'block-ui-animate-flip',
      'block-ui-animate-slide'
    ],
    startEndAnimation: 'block-ui-animate-flip',
    visibleAnimations: [
      'block-ui-animate-text-slide',
      'block-ui-animate-text-flash',
      'block-ui-animate-text-flip',
      'block-ui-animate-text-pulse'
    ],
    visibleAnimation: 'block-ui-animate-text-pulse',
    cssClass: function () {
      var ret = 'block-ui ';

      if ($scope.model.animate) {

        if ($scope.model.startEndAnimation) {
          ret += $scope.model.startEndAnimation + ' ';
        }

        if ($scope.model.visibleAnimation) {
          ret += $scope.model.visibleAnimation + ' ';
        }
        
        if(ret.length > 1) {
          ret = ret.substr(0, ret.length - 1);
        }
      }

      return ret;
    },
    htmlPreview: function() {
      
      var ret = '<div block-ui="myElementBlock"';
      
      if ($scope.model.animate) {
        ret += ' class="block-ui-animate';
        
        var css = $scope.model.cssClass();
        
        if(css) {
          ret += ' ' + css;
        }
        
        ret += '"'; 
      }
      
      ret += '>\n  <!-- ... -->\n  <p>Lorem ipsum dolor ...</p>\n  <!-- ... -->\n</div>';
      
      return ret;
    }
  };

  $scope.$watch('model.startEndAnimation', function (value, oldValue) {
    if (value !== oldValue) {
      $scope.toggleBlock();

      $timeout(function () {
        if (!block.isBlocking()) {
          $scope.toggleBlock();
        }
      }, 500);
    }
  });

});