// blkUI.directive('blockUiAnimate', function () {

//   var startEvent = 'block-ui-visible-start';
//   var visibleLoop = 'block-ui-visible-loop';
//   var endEvent = 'block-ui-visible-end';
//   var animationEndEvent = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
  
//   return {
//     priority: -100,
//     restrict: 'C',
//     link: function ($scope, $element, $attrs) {   
//       var instance = $element.data('block-ui');
      
//       $scope.$on(startEvent, function(e, args) {
//         if(args.instance === instance) {
//           $element.addClass(startEvent);
          
//           $element.one(animationEndEvent, function() {
            
//             if(instance.isBlocking()) {
//               $element.addClass(visibleLoop);  
//             }
            
//             $element.removeClass(startEvent);
//           });     
//         }
//       });
      
//       $scope.$on(endEvent, function(e, args) {
//         if(args.instance === instance) {
//           $element.removeClass(visibleLoop);
//           $element.addClass(endEvent);
          
//           $element.one(animationEndEvent, function() {
//             $element.removeClass(endEvent);
//           });     
//         }
//       });
//     }
//   };
// });
