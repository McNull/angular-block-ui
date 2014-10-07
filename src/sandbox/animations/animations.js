angular.module('myApp').controller('AnimationController', function($scope, $timeout, blockUI) {

//  $scope.toggleMyBlock = function() {
//    $scope.state = $scope.state || {};
//
//    if($scope.state.myBlockActive) {
//
////      if($scope.state.promise) {
////        $timeout.cancel($scope.state.promise);
////        delete $scope.state.promise;
////      }
//
//      if($scope.state.myBlockVisible) {
//        $scope.state.myBlockActive = false;
//        $scope.state.myBlockVisible = false;
//      } else {
//        $scope.state.myBlockVisible = true;
//      }
//
//
//    } else {
//      $scope.state.myBlockActive = true;
//
////      $scope.state.promise = $timeout(function() {
////        $scope.state.myBlockVisible = true;
////        delete $scope.state.promise;
////      }, 200);
//    }
//  };

//  $scope.startBlock = function(id, timeout) {
//
//    var blockInstance = blockUI.instances.get(id);
//
//    blockInstance.start();
//
//    if(timeout >= 0) {
//      $timeout(function() {
//        blockInstance.stop();
//      }, timeout);
//    }
//  };
//
//  $scope.stopBlock = function(id) {
//    var blockInstance = blockUI.instances.get(id);
//    blockInstance.stop();
//  };
//
//  $scope.toggleBlock = function(id) {
//    var blockInstance = blockUI.instances.get(id);
//
//    if(blockInstance.state().blocking) {
//      blockInstance.stop();
//    } else {
//      blockInstance.start();
//    }
//  };

  var animateConfig = {

    "attention_seekers": {
      "bounce": true,
      "flash": true,
      "pulse": true,
      "rubberBand": true,
      "shake": true,
      "swing": true,
      "tada": true,
      "wobble": true
    },

    "bouncing_entrances": {
      "bounceIn": true,
      "bounceInDown": true,
      "bounceInLeft": true,
      "bounceInRight": true,
      "bounceInUp": true
    },

    "bouncing_exits": {
      "bounceOut": true,
      "bounceOutDown": true,
      "bounceOutLeft": true,
      "bounceOutRight": true,
      "bounceOutUp": true
    },

    "fading_entrances": {
      "fadeIn": true,
      "fadeInDown": true,
      "fadeInDownBig": true,
      "fadeInLeft": true,
      "fadeInLeftBig": true,
      "fadeInRight": true,
      "fadeInRightBig": true,
      "fadeInUp": true,
      "fadeInUpBig": true
    },

    "fading_exits": {
      "fadeOut": true,
      "fadeOutDown": true,
      "fadeOutDownBig": true,
      "fadeOutLeft": true,
      "fadeOutLeftBig": true,
      "fadeOutRight": true,
      "fadeOutRightBig": true,
      "fadeOutUp": true,
      "fadeOutUpBig": true
    },

    "flippers": {
      "flip": true,
      "flipInX": true,
      "flipInY": true,
      "flipOutX": true,
      "flipOutY": true
    },

    "lightspeed": {
      "lightspeedIn": true,
      "lightspeedOut": true
    },

    "rotating_entrances": {
      "rotateIn": true,
      "rotateInDownLeft": true,
      "rotateInDownRight": true,
      "rotateInUpLeft": true,
      "rotateInUpRight": true
    },

    "rotating_exits": {
      "rotateOut": true,
      "rotateOutDownLeft": true,
      "rotateOutDownRight": true,
      "rotateOutUpLeft": true,
      "rotateOutUpRight": true
    },

    "specials": {
      "hinge": true,
      "rollIn": true,
      "rollOut": true
    },

    "zooming_entrances": {
      "zoomIn": true,
      "zoomInDown": true,
      "zoomInLeft": true,
      "zoomInRight": true,
      "zoomInUp": true
    },

    "zooming_exits": {
      "zoomOut": true,
      "zoomOutDown": true,
      "zoomOutLeft": true,
      "zoomOutRight": true,
      "zoomOutUp": true
    }

  };

  (function() {

    var options = [];

    angular.forEach(animateConfig, function(group, groupName) {
      angular.forEach(group, function(b, animName) {
        options.push({
          name: animName, group: groupName
        });
      });
    });


    $scope.animateCss = {
      options: options,
      selected: options[0]
    };

  })();

  $scope.$watch('animateCss.recompile', function(value) {

    if(!value) {
      $scope.animateCss.recompile = true;
    }
  });

  var blockInstance = blockUI.instances.get('animateCssTest');
  blockInstance.addRef();
  blockInstance.start();

});