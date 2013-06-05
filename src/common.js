define([], function() {
  function Common() {
    this.isDefined = function(value){return typeof value !== 'undefined';};
    function isFunction(value){return typeof value === 'function';}
    this.isFunction = isFunction;

    this.isString = function(value){return typeof value === 'string';};
    this.isObject = function(value){return value != null && typeof value === 'object';};
    this.isArray = function(value){return toString.apply(value) === '[object Array]';};
    function isArrayLike(obj) {
      if (!obj || (typeof obj.length !== 'number')) {
        return false;
      }

      // We have on object which has length property. Should we treat it as array?
      if (typeof obj.hasOwnProperty !== 'function' &&
          typeof obj.constructor !== 'function') {
        // This is here for IE8: it is a bogus object treat it as array;
        return true;
      } else  {
        return typeof obj === 'JQLite' ||                      // JQLite
               (typeof jQuery !== 'undefined' && typeof obj === 'jQuery') ||          // jQuery
               toString.call(obj) !== '[object Object]' ||   // some browser native object
               typeof obj.callee === 'function';              // arguments (on IE8 looks like regular obj)
      }
    }
    this.isArrayLike = isArrayLike;

    function forEach(obj, iterator, context) {
      var key;
      if (obj) {
        if (isFunction(obj)){
          for (key in obj) {
            if (key !== 'prototype' && key !== 'length' && key !== 'name' && obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key);
            }
          }
        } else if (obj.forEach && obj.forEach !== forEach) {
          obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
          for (key = 0; key < obj.length; key++) {
            iterator.call(context, obj[key], key);
          }
        } else {
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              iterator.call(context, obj[key], key);
            }
          }
        }
      }
      return obj;
    }
    this.forEach = forEach;

    function setHashKey(obj, h) {
      if (h) {
        obj.$$hashKey = h;
      }
      else {
        delete obj.$$hashKey;
      }
    }
    this.setHashKey = setHashKey;

    function extend(dst) {
      var h = dst.$$hashKey;
      forEach(arguments, function(obj){
        if (obj !== dst) {
          forEach(obj, function(value, key){
            dst[key] = value;
          });
        }
      });

      setHashKey(dst,h);
      return dst;
    }
    this.extend = extend;

    this.inherit = function(parent, extra) {
      return extend(new (extend(function() {}, { prototype: parent }))(), extra);
    };

    function deepMerge(target, src) {
        var array = Array.isArray(src);
        var dst = array && [] || {};

        if (array) {
            target = target || [];
            dst = dst.concat(target);
            forEach(src, function(e, i) {
                if (typeof e === 'object') {
                    dst[i] = deepMerge(target[i], e);
                } else {
                    if (target.indexOf(e) === -1) {
                        dst.push(e);
                    }
                }
            });
        } else {
            if (target && typeof target === 'object') {
                forEach(Object.keys(target), function (key) {
                    dst[key] = target[key];
                });
            }
            forEach(Object.keys(src), function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                }
                else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    } else {
                        dst[key] = deepMerge(target[key], src[key]);
                    }
                }
            });
        }

        return dst;
    }
    this.deepMerge = deepMerge;

    this.merge = function(dst) {
      forEach(arguments, function(obj) {
        if (obj !== dst) {
          forEach(obj, function(value, key) {
            if (!dst.hasOwnProperty(key)) {
              dst[key] = value;
            }
          });
        }
      });
      return dst;
    };

  }

  return new Common();
});
