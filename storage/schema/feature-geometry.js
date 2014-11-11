'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SchemaType = mongoose.SchemaType;
var Types = mongoose.Types;
var util = require('util');

function validate(geometry) {
  try {
    var coordinates = geometry.coordinates;

    switch(geometry.type) {
      case 'Point':
        return validatePoint(coordinates);
      case 'MultiPoint':
        return validateMultiPoint(coordinates);
      case 'LineString':
        return validateLineString(coordinates);
      case 'MultiLineString':
        return validateMultiLineString(coordinates);
      case 'Polygon':
        return validatePolygon(coordinates);
      case 'MultiPolygon':
        return validateMultiPolygon(coordinates);
      case 'GeometryCollection':
        return Array.isArray(geometry.geometries) &&
          geometry.geometries.every(validate);
      default:
        return false;
    }
  }
  catch(e) {
    return false;
  }
}

/**
 * @function
 * @private
 * @name validatePoint
 * @param {*}
 * @returns {Boolean}
 */
function validatePoint(v) {
  return Array.isArray(v) && v.length === 2 &&
    (v[0] >= -180 && v[0] <= 180 - 1e-10) &&
    (v[1] >= -90 && v[1] <= 90);
}

/**
 * @function
 * @private
 * @name validateMultiPoint
 * @param {*}
 * @returns {Boolean}
 */
function validateMultiPoint(v) {
  return Array.isArray(v) && v.length > 0 && v.every(validatePoint);
}

/**
 * @function
 * @private
 * @name validateLineString
 * @param {*}
 * @returns {Boolean}
 */
function validateLineString(v) {
  return Array.isArray(v) && v.length >= 2 && v.every(validatePoint);
}

/**
 * @function
 * @private
 * @name validateMultiLineString
 * @param {*}
 * @returns {Boolean}
 */
function validateMultiLineString(v) {
  return Array.isArray(v) && v.length > 0 && v.every(validateLineString);
}

/**
 * @function
 * @private
 * @name validateLinearRing
 * @param {*}
 * @returns {Boolean}
 */
function validateLinearRing(v) {
  return Array.isArray(v) && v.length >= 4 &&
    v[0][0] === v[v.length - 1][0] && v[0][1] === v[v.length - 1][1] &&
    v.every(validatePoint);
}

/**
 * @function
 * @private
 * @name validatePolygon
 * @param {*}
 * @returns {Boolean}
 */
function validatePolygon(v) {
  return Array.isArray(v) && v.length > 0 && v.every(validateLinearRing);
}

/**
 * @function
 * @private
 * @name validateMultiPolygon
 * @param {*}
 * @returns {Boolean}
 */
function validateMultiPolygon(v) {
  return Array.isArray(v) && v.length > 0 && v.every(validatePolygon);
}

/**
 * Schema for GeoJSON Geometries.
 * @constructor
 * @param {String} path
 * @param {Object} [options]
 */
function FeatureGeometry(path, options) {
  SchemaType.call(this, path, options);

  this.validate(validate);
}

/**
 * @inherits SchemaType
 */
util.inherits(FeatureGeometry, Schema.Types.Mixed);

/**
 * Implement checkRequired method.
 *
 * @param {Any} val
 * @returns {Boolean}
 */
FeatureGeometry.prototype.checkRequired = function (val) {
  return typeof val == 'object' && val != null;
};

/**
 * Implement casting.
 *
 * @param {Any} val
 * @returns {Object}
 */
FeatureGeometry.prototype.cast = function (val) {
  if(typeof val != 'object' || val == null) {
    throw new SchemaType.CastError('geometry', val, this.path);
  }

  return val;
};

/**
 * Email Query casting.
 *
 * @private
 */

function handleSingle(val) {
  return this.cast(val);
}

function handleArray(val) {
  return val.map(function (m) {
    return this.cast(m);
  }, this);
}

FeatureGeometry.prototype.$conditionalHandlers = {
  '$lt': handleSingle,
  '$lte': handleSingle,
  '$gt': handleSingle,
  '$gte': handleSingle,
  '$ne': handleSingle,
  '$in': handleArray,
  '$nin': handleArray,
  '$all': handleArray
};


/**
 * Casts contents for queries.
 *
 * @param {String} $conditional
 * @param {Any} [value]
 * @private
 */
FeatureGeometry.prototype.castForQuery = function ($conditional, val) {
  if(arguments.length === 1) {
    return this.cast($conditional);
  }

  var handler = this.$conditionalHandlers[$conditional];

  if(!handler) {
    throw new Error("Can't use " + $conditional + " with Email.");
  }

  return handler.call(this, val);
};

Schema.Types.FeatureGeometry = FeatureGeometry;
module.exports = FeatureGeometry;
