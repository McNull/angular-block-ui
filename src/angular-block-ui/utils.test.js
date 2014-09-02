describe('block-ui-utils', function() {

  var utils, $ = angular.element;

  beforeEach(function() {
    module('blockUI');

    inject(function(blockUIUtils) {
      utils = blockUIUtils;
    });
  });

  describe('buildRegExp', function() {
    it('should create a RegExp object', function() {
      var result = utils.buildRegExp('/\d+/');
      
      expect(result).toBeDefined();
      expect(result.constructor.name).toBe('RegExp');
    });

    it('should parse expression', function() {
      var expression = '\d\d\d';
      var result = utils.buildRegExp('/' + expression + '/');

      expect(result.source).toBe(expression);
    });

    it('should parse global flag', function() {
      
      var result = utils.buildRegExp('/123/g');

      expect(result.global).toBe(true);
      expect(result.ignoreCase).toBe(false);
      expect(result.multiline).toBe(false);
    });

    it('should parse ignoreCase flag', function() {
      
      var result = utils.buildRegExp('/123/i');

      expect(result.global).toBe(false);
      expect(result.ignoreCase).toBe(true);
      expect(result.multiline).toBe(false);
    });

    it('should parse multiline flag', function() {
      
      var result = utils.buildRegExp('/123/m');

      expect(result.global).toBe(false);
      expect(result.ignoreCase).toBe(false);
      expect(result.multiline).toBe(true);
    });
  }); // buildRegExp
  
  describe('forEachFn', function() {

    it('should execute function on each element', function() {

      function Item() {
        this.fn = function() {
          this.executed = true;
        }
      }

      var arr = [ new Item(), new Item(), new Item() ];

      utils.forEachFn(arr, 'fn');

      expect(arr[0].executed).toBe(true);
      expect(arr[1].executed).toBe(true);
      expect(arr[2].executed).toBe(true);
    });

    it('should pass arguments to each function call', function() {

      function Item() {
        this.fn = function(v1, v2, v3) {
          this.v1 = v1;
          this.v2 = v2;
          this.v3 = v3;
        }
      }

      var arr = [ new Item() ];
      var args = [ 1, 2, 3 ];
      utils.forEachFn(arr, 'fn', args);

      expect(arr[0].v1).toBe(1);
      expect(arr[0].v2).toBe(2);
      expect(arr[0].v3).toBe(3);
      
    });

    it('should be able to be hook function', function() {

      function Item() {
        this.fn = function(v1, v2, v3) {
          this.v1 = v1;
          this.v2 = v2;
          this.v3 = v3;
        }
      }

      var arr = [ new Item() ];

      utils.forEachFnHook(arr, 'fn');
      
      arr.fn(1,2,3);

      expect(arr[0].v1).toBe(1);
      expect(arr[0].v2).toBe(2);
      expect(arr[0].v3).toBe(3);
      
    });

  }); // forEachFn

  describe('findElement', function() {

    it('should return the current element', function() {

      function myPredicate($e) {
        return $e.hasClass('my-class');
      }

      var $element = $('<div class="my-class"></div>');

      var result = utils.findElement($element, myPredicate);

      expect(result).toBe($element);

    });

    it('should return the child element', function() {

      function myPredicate($e) {
        return $e.hasClass('my-class');
      }

      var $element = $('<div><div class="my-class"></div></div>');
      var expected = $element.children()[0];

      var result = utils.findElement($element, myPredicate);

      expect(result[0]).toBe(expected);

    });

    it('should return the parent element', function() {

      function myPredicate($e) {
        return $e.hasClass('my-class');
      }

      var expected = $('<div class="my-class"><div></div></div>');
      var $element = $(expected.children()[0]);

      var result = utils.findElement($element, myPredicate, true);

      expect(result[0]).toBe(expected[0]);

    });

  });

});