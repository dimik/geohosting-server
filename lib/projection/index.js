'use strict';

var _ = require('lodash');
var GeoToGlobalPixelsProjection = require('./geo-to-global-pixels');

var params = {
  wgs84Mercator: {},
  sphericalMercator: { e: 0 }
};

exports.create = function (projection, options) {
  return new GeoToGlobalPixelsProjection(_.extend({}, options, params[projection]));
};
