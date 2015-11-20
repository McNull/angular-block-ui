blkUI.constant('blockUIConfig', {
    templateUrl: 'angular-block-ui/angular-block-ui.ng.html',
    delay: 250,
    message: "Loading ...",
    autoBlock: true,
    resetOnException: true,
    requestFilter: angular.noop,
    autoInjectBodyBlock: true,
    cssClass: 'block-ui block-ui-animate block-ui-animate-slide block-ui-animate-text-slide',
    blockBrowserNavigation: false
});

