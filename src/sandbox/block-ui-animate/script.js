
var app = angular.module('myApp', ['blockUI']);

app.directive('blockUiAnimate', function ($timeout) {

  function getChild(parent, selector) {
    var child, needsId = !parent.id;

    if (needsId) {
      parent.id = 'TEMPID____' + (new Date()).getTime();
    }

    child = document.querySelector('#' + parent.id + ' ' + selector);

    if (needsId) {
      parent.id = '';
    }

    return child;
  }

  return {
    priority: -100,
    restrict: 'C',
    link: function ($scope, $element, $attrs) {   
      var $container = getChild($element[0], '.block-ui-container');
      var instance = $element.data('block-ui');
      
    }
  };
});


app.controller('MyController', function ($scope, blockUI) {
  var block = blockUI.instances.get('blockUIAnimated');

  $scope.toggleBlock = function () {
    block.isBlocking() ? block.stop() : block.start();
  };

  $scope.toggleBlock();

});