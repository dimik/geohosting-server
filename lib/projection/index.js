var utils = require('../utils');
var GeoToGlobalPixelsProjection = require('./geo-to-global-pixels');

var params = {
  wgs84Mercator: {},
  sphericalMercator: { e: 0 }
};

exports.create = function (projection, options) {
  return new GeoToGlobalPixelsProjection(utils.extend({}, options, params[projection]));
};
