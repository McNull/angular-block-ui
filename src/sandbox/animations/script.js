// Code goes here

var animations = angular.module('blockUIAnim', ['blockUI']);

animations.config(function (blockUIConfig) {
  blockUIConfig.animations = {
    enabled: true,
    start: 'flipInX',
    end: 'flipOutY'
  };
});

animations.directive('blockUiAnim', function (blockUIConfig, $timeout) {

  // function singleOrDefault(arr, predicate) {
  //   for (var i = 0; i < arr.length; i++) {
  //     var a = arr[i];
  //     if (predicate(a, i)) {
  //       return a;
  //     }
  //   }
  // }

  // function locateChildElement($parent, className) {
  //   return angular.element(singleOrDefault($parent.children(), function (x) {
  //     var classes = x.className.split(' ');
  //     for (var i = 0; i < classes.length; i++) {
  //       if (classes[i] == className) {
  //         return true;
  //       }
  //     }
  //   }));
  // }

  // function applyVendorCss($element, property, value) {
  //   $element.css('-webkit-' + property, value);
  //   $element.css('-moz-' + property, value);
  //   $element.css('-ms-' + property, value);
  //   $element.css(property, value);
  // }

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
    restrict: 'A',
    priority: -100,
    link: function ($scope, $element, $attrs) {

      if (document.querySelector) {

        var instance = $element.data('block-ui'), $message, currentClass, settings = angular.copy(blockUIConfig.animations);

        function setAnimation(source, animClass) {
          if (source === instance) {
              $message = $message || angular.element(getChild($element[0], '> .block-ui-container .block-ui-message'));
              $message.removeClass(currentClass);
              $message.addClass(animClass);
              currentClass = animClass;
            }
        }
        
        if (instance) {
          $scope.$on('block-ui-visible-start', function (e, args) {
            setAnimation(args.instance, settings.start);
          });

          $scope.$on('block-ui-visible-end', function (e, args) {
            setAnimation(args.instance, settings.end);
          });
          
          $attrs.$observe('blockUiAnimStart', function(value) {
            settings.start = value;
          });
          
          $attrs.$observe('blockUiAnimEnd', function(value) {
            settings.end = value;
          });
        }
        
      }
      
      // var settings = angular.copy(blockUIConfig.animations);

      // function apply() {

      //   var $blockUiContainer = locateChildElement($element, 'block-ui-container');
      //   var $messageContainer = locateChildElement($blockUiContainer, 'block-ui-message-container');
      //   var $message = locateChildElement($messageContainer, 'block-ui-message');

      //   // console.log('Applying', settings);

      //   // var duration = settings.duration + 'ms';

      //   // var containerTransition = 'height 0s linear ' + duration + ', opacity ' + duration + ' ease 0s';

      //   // applyVendorCss($blockUiContainer, 'transition', containerTransition);
      //   // applyVendorCss($message, 'animation-duration', duration);
      // }

      // var applyInQueue;
      // function queueApply() {
      //   if (!applyInQueue) {
      //     applyInQueue = $timeout(function () {
      //       apply();
      //       applyInQueue = null;
      //     });
      //   }
      // }


      // // $attrs.$observe('blockUiAnim', function (value, prevValue) {
      // //   settings.enabled = value !== 'false';
      // //   queueApply();
      // // });

      // // $attrs.$observe('blockUiAnimDuration', function (value, prevValue) {
      // //   settings.duration = parseInt(value);
      // //   queueApply();
      // // });


      // queueApply();
    }
  };
});

var app = angular.module('myApp', ['blockUI', 'blockUIAnim']);

app.config(function (blockUIConfig) {
  //
});

app.controller('AnimationController', function ($scope, $timeout, animationNames, blockUI, blockUIConfig) {
  
  (function () {

    var options = [], blockStart, blockEnd;

    angular.forEach(animationNames, function (group, groupName) {
      angular.forEach(group, function (b, animName) {
        
        var option = {
          name: animName, group: groupName
        };
        
        options.push(option);
        
        if(blockUIConfig.animations.start == animName) {
          blockStart = option;    
        }
        
        if(blockUIConfig.animations.end == animName) {
          blockEnd = option;    
        }
        
      });
    });
    
    $scope.animateCss = {
      options: options,
      blockStart: blockStart,
      blockEnd: blockEnd
    };

    // $scope.$watch('animateCss.blockStart', function(value) {
    //   blockUIConfig.animations.start = value.name;
    // });
    
    // $scope.$watch('animateCss.blockEnd', function(value) {
    //   blockUIConfig.animations.end = value.name;
    // });
    
  })();

  var blockInstance = blockUI.instances.get('animateCssTest');

  $scope.toggleBlock = function () {
    if (blockInstance.isBlocking()) {
      blockInstance.stop();
    } else {
      blockInstance.start();
    }
  };

});

app.value('animationNames', {

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

});
