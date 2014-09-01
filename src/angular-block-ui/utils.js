
blkUI.factory('blockUIUtils', function() {
  var $ = angular.element;

  var utils = {
    buildRegExp: function(pattern) {
      var match = pattern.match(/^\/(.*)\/([gim]*)$/), regExp;

      if(match) {
        regExp = new RegExp(match[1], match[2]);
      } else {
        throw Error('Incorrect regular expression format: ' + pattern);
      }

      return regExp;
    },
    forEachFn: function(arr, fnName, args) {
      var i = arr.length;
      while(i--) {
        var t = arr[i];
        t[fnName].apply(t, args);
      }
    },
    forEachFnHook: function(arr, fnName) {
      arr[fnName] = function() {
        utils.forEachFn(this, fnName, arguments);
      }
    },
    isElementInBlockScope: function($element, blockScope) {

      var c = $element.inheritedData('block-ui');

      while(c) {
        if(c === blockScope) {
          return true;
        }

        c = c._parent;
      }

      return false;
    },
    findElement: function($element, className) {

      var ret = null;

      if($element.hasClass(className)) {
        ret = $element;
      } else {
        var $childs = $element.children();

        var i = $childs.length;
        while(!ret && i--) {
          ret = utils.findElement($($childs[i]), className);
        }
      }

      return ret;
    }
  };

  return utils;

});