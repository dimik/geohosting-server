'use strict';

exports.math = require('./math');

/**
 * Creates or returns uniq Id for an arbitrary object.
 * @function
 * @name Utils.stamp
 * @param {Object}
 * @returns {String} Object Id
 */
exports.stamp = (function () {
  var ids = 0;
  var key = '__id';

  return function (obj) {
    if(obj[key]) {
      return obj[key];
    }

    return obj[key] = ids++;
  };
}());

/**
 * Extends an arbitrary object with properties of another object[s].
 * @function
 * @name Utils.extend
 * @param {Object} target
 * @param {Object} source One or more source objects.
 * @returns {Object} Extended target object.
 */
exports.extend = function (target) {
  var slice = Array.prototype.slice;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var isObject = function (o) {
    return typeof o == 'object' && o != null;
  };

  slice.call(arguments, 1).forEach(function (o) {
    if(isObject(o)) {
      for(var key in o) {
        hasOwnProperty.call(o, key) && typeof o[key] !== 'undefined' && (target[key] = o[key]);
      }
    }
  });

  return target;
};

/**
 * Returns an array of numbers in the certain range.
 * @function
 * @name Utils.range
 * @param {Number} start
 * @param {Number} stop Not inclusive.
 * @param {Number} step
 * @returns {Number[]} Range of numbers.
 */
exports.range = function (start, stop, step) {
  if(arguments.length <= 1) {
    stop = start || 0;
    start = 0;
  }
  step = step || 1;

  var result = [];
  var len = Math.max(Math.ceil((stop - start) / step), 0);

  for(var i = 0; i < len; i++, start += step) {
    result[i] = start;
  }

  return result;
};
