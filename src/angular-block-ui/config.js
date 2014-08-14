angular.module('blockUI').provider('blockUIConfig', function() {

  var _config = {
    templateUrl: 'angular-block-ui/angular-block-ui.ng.html',
    delay: 250,
    message: "Loading ...",
    autoBlock: true,
    resetOnException: true,
    requestFilter: angular.noop
  };

  this.templateUrl = function(url) {
    _config.templateUrl = url;
  };

  this.template = function(template) {
    _config.template = template;
  };

  this.delay = function(delay) {
    _config.delay = delay;
  };

  this.message = function(message) {
    _config.message = message;
  };

  this.autoBlock = function(enabled) {
    _config.autoBlock = enabled;
  };

  this.resetOnException = function(enabled) {
    _config.resetOnException = enabled;
  };

  this.requestFilter = function(filter) {
    _config.requestFilter = filter;
  };

  this.$get = function() {
    return _config;
  };
});
