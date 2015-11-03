// Code goes here

var app = angular.module('myApp', ['blockUI']);

angular.module('myApp').controller('AnimationController', function($scope, $timeout, blockUI) {

  // Animation visible in the selectbox
  
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

  var blockInstance = blockUI.instances.get('animateCssTest');
  
  $scope.toggleBlock = function() {
    if(blockInstance.isBlocking()) {
      blockInstance.stop();    
    } else {
      blockInstance.start();
    }
  };
  

});