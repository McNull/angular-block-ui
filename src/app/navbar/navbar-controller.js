angular.module('myApp').controller('NavbarController', function ($scope, $location, navItems) {

  var self = this;

  this.setActiveNavItem = function(url) {

    for(var i = 0; i < navItems.length; i++) {

      var navItem = navItems[i];
      var regexp = navItem.$_regexp;

      if(!regexp) {
        var pattern = navItem.pattern;

        if (!pattern) {
          pattern = navItem.url || '/';
          pattern = pattern.replace(/^#!/, '')
        }

        regexp = new RegExp('^' + pattern + '$', 'i');
        navItem.$_regexp = regexp;
      }

      navItem.isActive = regexp.test(url);
    }
  };

  $scope.navItems = navItems;

  $scope.$watch(function () {
    return $location.path();
  }, function(newValue) { self.setActiveNavItem(newValue) });

  $scope.navItems.isCollapsed = true;

  $scope.toggleCollapse = function() {
    $scope.navItems.isCollapsed = !$scope.navItems.isCollapsed;
  };

  $scope.collapseNavItems = function() {
    $scope.navItems.isCollapsed = true;
  };

});
