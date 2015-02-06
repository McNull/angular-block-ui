blkUI.config(function ($provide) {
  $provide.decorator('$location', decorateLocation);
});

var decorateLocation = [
  '$delegate', 'blockUI', 'blockUIConfig',
  function ($delegate, blockUI, blockUIConfig) {

    if (blockUIConfig.blockBrowserNavigation) {

      blockUI.$_blockLocationChange = true;

      var overrides = ['url', 'path', 'search', 'hash', 'state'];

      function hook(f) {
        var s = $delegate[f];
        $delegate[f] = function () {

          //        console.log(f, Date.now(), arguments);

          var result = s.apply($delegate, arguments);

          // The call was a setter if the $location service is returned.

          if (result === $delegate) {

            // Mark the mainblock ui to allow the location change.

            blockUI.$_blockLocationChange = false;
          }

          return result;
        };
      }

      angular.forEach(overrides, hook);

    }

    return $delegate;
}];

// Called from block-ui-directive for the 'main' instance.

function blockNavigation($scope, mainBlockUI, blockUIConfig) {

  if (blockUIConfig.blockBrowserNavigation) {

    function registerLocationChange() {

      $scope.$on('$locationChangeStart', function (event) {

        //        console.log('$locationChangeStart', mainBlockUI.$_blockLocationChange + ' ' + mainBlockUI.state().blockCount);

        if (mainBlockUI.$_blockLocationChange && mainBlockUI.state().blockCount > 0) {
          event.preventDefault();
        }
      });

      $scope.$on('$locationChangeSuccess', function () {
        mainBlockUI.$_blockLocationChange = blockUIConfig.blockBrowserNavigation;

        //        console.log('$locationChangeSuccess', mainBlockUI.$_blockLocationChange + ' ' + mainBlockUI.state().blockCount);
      });
    }

    if (moduleLoaded('ngRoute')) {

      // After the initial content has been loaded we'll spy on any location
      // changes and discard them when needed.

      var fn = $scope.$on('$viewContentLoaded', function () {

        // Unhook the view loaded and hook a function that will prevent
        // location changes while the block is active.

        fn();
        registerLocationChange();

      });

    } else {
      registerLocationChange();
    }

  }
}