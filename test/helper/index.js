'use strict';

var _ = require('lodash');

/**
 * Creates GeoJSON Feature type Point.
 * @function
 * @name createFeature
 * @returns {Object}
 */
exports.createFeature = function () {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [ _.random(-180, 180 - 1e-10, true), _.random(-85, 85, true) ]
    },
    properties: {
      balloonContent: 'The quick brown fox jumps over the lazy dog',
      hintContent: 'The quick brown fox jumps over the lazy dog'
    }
  };
};
