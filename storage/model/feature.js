'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var connection = require('..');
var schema = require('../schema/feature');
var GeoProjection = require('../../lib/projection');
var TileSystem = require('../../lib/tile-system');
var tileSystem = new TileSystem({
  projection: GeoProjection.create('wgs84Mercator')
});

/**
 * Middleware that assigns quadKey on point coordinates.
 */
schema.pre('save', function (next) {
  var geometry = this.geometry;
  var coords = geometry.coordinates;

  if(geometry.type === 'Point') {
    this._quadKey = tileSystem.coordinatesToQuadKey(coords);
    this._lng = coords[0];
    this._lat = coords[1];
  }
  next();
});

schema.static('getById', function (id, cb) {
  var query;

  try {
    query = { _id: ObjectId.createFromHexString(id.toString()) };
  }
  catch (err) {
    query = { id: id };
  }

  return module.exports.findOne(query, cb);
});

schema.static('findInTiles', function (tiles, options, cb) {
  var quadKeys = tiles.map(function (tile) {
    return tileSystem.tileNumberToQuadKey(tile, options.zoom);
  });
  var query = { _quadKey: { $regex: '^(' + quadKeys.join('|') + ')' } };

  if(options.clusterize) {
    // for version 2.6
    return clusterize.call(this, query, options, cb);
    // for version below than 2.6
    // return clusterizeMapReduce.call(this, query, options, cb);
  }

  return this.find(query, cb);
});

/**
 * Clusterize using MongoDB Aggregation pipeline (for version 2.6 and above).
 * @function
 * @name clusterize
 * @param {Object} query MongoDB query
 * @param {Object} options
 * @param {Function} cb Request callback
 * @returns {Promise}
 */
function clusterize(query, options, cb) {
  var gridSize = options.gridSize || 256;
  var zoom = options.zoom;
  var levels = zoom + 256 / gridSize;

  return this.aggregate([{
    $match: query
  }, {
    $group: {
      _id: { $substr: [ '$_quadKey', 0, levels ] },
      // ids: { $push: '$_id' },
      // features: { $push: '$$ROOT' },
      feature: { $first: '$$ROOT' },
      lng: { $avg: '$_lng' },
      lat: { $avg: '$_lat' },
      north: { $max: '$_lat' },
      south: { $min: '$_lat' },
      east: { $max: '$_lng' },
      west: { $min: '$_lng' },
      count: { $sum: 1 }
    }
  }], function (err, data) {
    if(err) {
      return cb(err);
    }
    cb(null, data.map(function (it) {
      return it.count > 1? {
        id: it._id,
        type: 'Cluster',
        bbox: [ [ it.west, it.south ], [ it.east, it.north ] ],
        geometry: {
          type: 'Point',
          coordinates: [ it.lng, it.lat ]
        },
        number: it.count,
        properties: {
          // ids: it.ids,
          iconContent: it.count
        }
        // return Feature model instance.
      } : new module.exports(it.feature);
    }));
  });
}

/**
 * Clusterize using MongoDB MapReduce (for earlier versions than 2.6)
 * @function
 * @name clusterize
 * @param {Object} query MongoDB query
 * @param {Object} options
 * @param {Function} cb Request callback
 * @returns {Promise}
 */
function clusterizeMapReduce(query, options, cb) {
  var gridSize = options.gridSize || 256;
  var zoom = options.zoom;
  var levels = zoom + 256 / gridSize;

  return this.mapReduce({
    query: query,
    map: function () {
      emit(this._quadKey.substr(0, levels), this);
    },
    reduce: function (key, values) {
      var result = {
        ids: [],
        lat: 0,
        lng: 0,
        north: -90,
        south: 90,
        east: -180,
        west: 180 - 1e-10,
        count: values.length
      };

      values.forEach(function (it) {
        result.ids.push(it._id);
        result.lat += it._lat;
        result.lng += it._lng;
        result.north = Math.max(result.north, it._lat);
        result.south = Math.min(result.south, it._lat);
        result.east = Math.max(result.east, it._lng);
        result.west = Math.min(result.west, it._lng);
      });

      return result;
    },
    finalize: function (key, reduced) {
      return reduced.count? {
        id: key,
        type: 'Cluster',
        geometry: {
          type: 'Point',
          coordinates: [
            reduced.lng / reduced.count,
            reduced.lat / reduced.count
          ]
        },
        number: reduced.count,
        properties: {
          ids: reduced.ids,
          iconContent: reduced.count
        },
        bbox: [ [ reduced.west, reduced.south ], [ reduced.east, reduced.north ] ],
      } : reduced;
    },
    scope: {
      levels: levels
    }
  }, function (err, results) {
    if(err) {
      return cb(err);
    }

    cb(null, results.map(function (it) {
      return it.value;
    }));
  });
}

module.exports = connection.model('Feature', schema);
