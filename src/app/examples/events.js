
angular.module('myApp').controller('SimpleEventHandlerController', function ($scope, blockUI) {

  $scope.$on('block-ui-active-start', function (e, args) {
    
    // Check if it is the correct block ui instance (skip if you don't care)
    if (args.id === 'myBlock') {
  
      // Update the message displayed by the instance
      args.instance.message('Activate start handled!');

    }

  });

  $scope.toggleBlock = function () {
    var instance = blockUI.instances.get('myBlock');
    instance.isBlocking() ? instance.stop() : instance.start();
  };


});

angular.module('myApp').controller('MonitorEventsController', function ($scope, blockUI, $timeout, inform) {

  var instances = $scope.instances = {
    one: {
      color: 'success'
    },
    two: {
      color: 'warning'
    },
    three: {
      color: 'info'
    }
  };

  function toggleBlock(id) {
    var instance = blockUI.instances.get(id);
    instance.isBlocking() ? instance.stop() : instance.start();
  }

  function tick(id) {

    toggleBlock(id);

    var delay = Math.floor(Math.random() * 5000);

    instances[id].timer = $timeout(function () {
      tick(id);
    }, delay);

  }

  function tock(id) {
    $timeout.cancel(instances[id].timer);
    blockUI.instances.get(id).stop();
  }


  $scope.toggleTimer = function (forceStop) {
    if ($scope.running || forceStop) {

      angular.forEach($scope.instances, function (o, id) {
        tock(id);
      });

      inform.clear();

      if ($scope.running) {
        inform.add('Timer stopped', {
          type: 'primary'
        });

        $scope.running = false;
      }

    } else {

      inform.add('Timer started', {
        type: 'primary'
      });

      angular.forEach($scope.instances, function (o, id) {
        tick(id);
      });

      $scope.running = true;
    }
  };

  $scope.$on('$destroy', function () {
    $scope.toggleTimer(true);
  });

  $scope.events = {
    'block-ui-active-start': false,
    'block-ui-active-end': true,
    'block-ui-visible-start': false,
    'block-ui-visible-end': false
  };

  var eventHandlers = {};

  $scope.$watchCollection('events', function () {
    angular.forEach($scope.events, function (enabled, event) {
      if (enabled) {
        if (!eventHandlers[event]) {
          eventHandlers[event] = $scope.$on(event, function (e, args) {
            if ($scope.instances[args.id]) {
              inform.add('Instance ' + args.id + ': ' + event, {
                type: $scope.instances[args.id].color
              });
            }
          });
        }
      } else {
        if (eventHandlers[event]) {
          eventHandlers[event]();
          delete eventHandlers[event];
        }
      }
    });
  });

});