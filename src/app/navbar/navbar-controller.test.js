describe('NavbarController', function() {

  var $injector, $controller, $rootScope, $location;

  beforeEach(module('myApp'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $location = _$location_;
  }));

  it('should be able to construct controller', function() {

    // Arrange

    var $scope = $rootScope.$new();

    // Act

    var controller = $controller('NavbarController', { $scope: $scope });

    // Assert

    expect(controller).toBeDefined();

  });

  it('should call setActiveNavItem on construction', function() {

    // Arrange

    var $scope = $rootScope.$new();

    var ctrl = $controller('NavbarController', { $scope: $scope });
    spyOn(ctrl, 'setActiveNavItem');

    // Act

    $scope.$apply();

    // Assert

    expect(ctrl.setActiveNavItem).toHaveBeenCalled();
  });

  it('should call setActiveNavItem on location changes', function() {

    // Arrange

    var url = '/einsweidriedus';
    var $scope = $rootScope.$new();

    var ctrl = $controller('NavbarController', { $scope: $scope, $location: $location });

    // Act

    $scope.$apply(); // flush the construction watch call

    spyOn(ctrl, 'setActiveNavItem');

    $location.path(url);
    $scope.$apply();

    // Assert

    expect(ctrl.setActiveNavItem).toHaveBeenCalledWith(url);
  });

  it('should set active item on exact url match', function() {

    // Arrange

    var url = '/einsweidriedus';

    var navItems = [
      { text: 'DoeMijDieMa', url: url },
      { text: 'DezeNiet', url: '/noMatch' }
    ];

    var ctrl = $controller('NavbarController', { $scope: $rootScope.$new(), navItems: navItems });

    // Act

    ctrl.setActiveNavItem(url);

    // Assert

    expect(navItems[0].isActive).toBe(true);
    expect(navItems[1].isActive).toBeFalsy();

  });

  it('should not set active item on partial url match', function() {

    // Arrange

    var url = '/einsweidriedus/ennogwat';

    var navItems = [
      { text: 'DoeMijDieMa', url: '/einsweidriedus' },
      { text: 'DezeNiet', url: '/noMatch' }
    ];

    var ctrl = $controller('NavbarController', { $scope: $rootScope.$new(), navItems: navItems });

    // Act

    ctrl.setActiveNavItem(url);

    // Assert

    expect(navItems[0].isActive).toBeFalsy();
    expect(navItems[1].isActive).toBeFalsy();

  });

  it('should use pattern to match active item', function() {

    // Arrange

    var url = '/einsweidriedus/ennogwat?dus=123';

    var navItems = [
      { text: 'DoeMijDieMa', url: '/einsweidriedus', pattern: "/einsweidriedus(/.*)?" },
      { text: 'DezeNiet', url: '/noMatch' }
    ];

    var ctrl = $controller('NavbarController', { $scope: $rootScope.$new(), navItems: navItems });

    // Act

    ctrl.setActiveNavItem(url);

    // Assert

    expect(navItems[0].isActive).toBeTruthy();
    expect(navItems[1].isActive).toBeFalsy();

  });
});
