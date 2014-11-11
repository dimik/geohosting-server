'use strict';

/**
 * Utils.math.cycleRestrict
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
exports.cycleRestrict = function (value, min, max) {
  if(value == Number.POSITIVE_INFINITY) {
    return max;
  }
  else if(value == Number.NEGATIVE_INFINITY) {
    return min;
  }

  return value - Math.floor((value - min) / (max - min)) * (max - min);
};

/**
 * Utils.math.restrict
 * @param {Number} value
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
exports.restrict = function (value, min, max) {
  return Math.max(Math.min(value, max), min);
};
