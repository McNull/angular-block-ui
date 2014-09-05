
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
    findElement: function ($element, predicateFn, traverse) {
      var ret = null;

      if (predicateFn($element)) {
        ret = $element;
      } else {

        var $elements;

        if (traverse) {
          $elements = $element.parent();
        } else {
          $elements = $element.children();
        }

        var i = $elements.length;
        while (!ret && i--) {
          ret = utils.findElement($($elements[i]), predicateFn, traverse);
        }
      }

      return ret;
    },
    indexOf: function(arr, obj, start) {
//      if(Array.prototype.indexOf) {
//        return arr.indexOf(obj, start);
//      }

      for (var i = (start || 0), j = arr.length; i < j; i++) {
        if (arr[i] === obj) {
          return i;
        }
      }

      return -1;
    }
  };

  return utils;

});