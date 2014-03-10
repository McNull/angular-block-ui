angular.module('showdown', []);

angular.module('showdown').directive('showdown', function(showdown, showdownConfig) {

  return {
    restrict: 'EA',
    link: function($scope, $element, $attrs) {

      var options = angular.copy(showdownConfig);

      options.outline = $attrs.showdownSrc ? $attrs.showdownSrc == 'true' : options.outline;
      options.src = $attrs.showdownSrc;

      $scope.$watch($attrs.showdownModel, function(value) {
        options.markdown = value;
        showdown.updateElement($element, options);
      });
    }
  };
});

angular.module('showdown').provider('showdownConfig', function() {
  var config = {
    extensions: [],
    css: {
      loading: 'showdown-loading',
      error: 'showdown-error'
    },
    outline: true
  };
  this.$get = function() {
    return config;
  };
});

angular.module('showdown').factory('showdown', function($http) {

  var _converter;

  function getConverter(options) {

    // options: { extensions: ['twitter', mine] }
    // TODO: Locate (and create) converter based on extensions

    _converter = _converter || new Showdown.converter(options);

    return _converter;
  }

  function makeHtml(options) {

    var converter = getConverter(options);

    return converter.makeHtml(options.markdown || options.defaultMarkdown);
  }

  function outline(text) {
    if (text) {

      // trim leading empty lines

      text = text.replace(/^\s*\n/, '');

      // grab the first ident on the first line

      var m = text.match(/^[ \t]+/);
      if (m && m.length) {

        // build a pattern to strip out the located ident from all lines

        var p = '^[ \t]{' + m[0].length + '}';
        var r = new RegExp(p, 'gm');
        text = text.replace(r, '');
      }
    }

    return text;
  }

  function updateElement($element, options) {

    if (options.defaultMarkdown === undefined) {

      var t = $element.text();

      if (options.outline) {
        t = outline(t);
      }

      options.defaultMarkdown = t;
    }

    if (options.src) {

      $element.addClass(options.css.loading);
      $element.removeClass(options.css.error);
      options.markdown = '';

      $http.get(options.src).then(function(response) {
        options.markdown = response.data;
        $element.removeClass(options.css.error);
      })['catch'](function() {
        $element.addClass(options.css.error);
      })['finally'](function() {
        $element.removeClass(options.css.loading);
        options.src = undefined;
        updateElement($element, options);
      });
    } else {
      var html = makeHtml(options);
      $element.html(html);
    }

  }

  return {
    makeHtml: makeHtml,
    updateElement: updateElement,
    outline: outline
  };
});
