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
