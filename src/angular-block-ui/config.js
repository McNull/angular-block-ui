blkUI.constant('blockUIConfig', {
    templateUrl: 'angular-block-ui/angular-block-ui.ng.html',
    delay: 250,
    message: "Loading ...",
    autoBlock: true,
    resetOnException: true,
    requestFilter: angular.noop,
    autoInjectBodyBlock: true,
    cssClass: 'block-ui block-ui-anim-fade'
});

//  this.templateUrl = function (url) {
//    _config.templateUrl = url;
//  };
//
//  this.template = function (template) {
//    _config.template = template;
//  };
//
//  this.delay = function (delay) {
//    _config.delay = delay;
//  };
//
//  this.message = function (message) {
//    _config.message = message;
//  };
//
//  this.autoBlock = function (enabled) {
//    _config.autoBlock = enabled;
//  };
//
//  this.resetOnException = function (enabled) {
//    _config.resetOnException = enabled;
//  };
//
//  this.requestFilter = function (filter) {
//    _config.requestFilter = filter;
//  };
//
//  this.autoInjectBodyBlock = function (enabled) {
//    _config.autoInjectBodyBlock = enabled;
//  };
//
//  function _cssClassArray(target) {
//    return function(classes, replace) {
//      if (classes !== undefined) {
//
//        if (angular.isString(classes)) {
//          classes = classes.split(' ');
//        }
//
//        if (replace) {
//          _config[target] = classes;
//        } else {
//          var i = classes.length;
//
//          while (i--) {
//            _config[target].push(classes[i]);
//          }
//        }
//      }
//    }
//  }
//
//  this.cssClass = _cssClassArray('cssClass');
//  this.cssClassMessage = _cssClassArray('cssClassMessage');
//
//  this.$get = ['$templateCache', function ($templateCache) {
//
//    if (_config.template) {
//
//      // Swap the builtin template with the custom template.
//      // Create a unique cache key and place the template in the cache.
//
//      _config.templateUrl = '$$block-ui-template$$';
//      $templateCache.put(_config.templateUrl, _config.template);
//    }
//
//    return _config;
//  }];
//});
