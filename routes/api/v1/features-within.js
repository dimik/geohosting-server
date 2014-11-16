'use strict';

var _ = require('lodash');
var Feature = require('../../../storage/model/feature');

var express = require('express');
var router = express.Router();

module.exports = router;

router.route('/bounds')
  .get(findFeaturesWithinBounds);

router.route('/tiles')
  .get(findFeaturesWithinTiles);

router.route('/polygon')
  .get(findFeaturesWithinPolygon);

router.route('/circle')
  .get(findFeaturesWithinCircle);


/**
 * Find features in bounding box.
 */
function findFeaturesWithinBounds(req, res, next) {
}

/**
 * Find features in tile bounds.
 */
function findFeaturesWithinTiles(req, res, next) {
  var tileBounds = req.query.bbox.split(',').map(Number);
  var xRange = _.range(tileBounds[0], tileBounds[2] + 1);
  var yRange = _.range(tileBounds[1], tileBounds[3] + 1);
  var zoom = Number(req.query.zoom);
  var clusterize = req.query.clusterize;
  var options = {
    zoom: zoom,
    gridSize: 128,
    clusterize: clusterize === 'true' || clusterize === '1'
  };
  var tiles = _.flatten(xRange.map(function (x) {
    return yRange.map(function (y) { return [x, y]; });
  }), true);

  Feature.findInTiles(tiles, options, function (err, data) {
    if(err) {
      return next(err);
    }

    res.status(200).jsonp({
      error: null,
      data: {
        type: 'FeatureCollection',
        features: data
      }
    });
    /*
    res.status(200).json({
      type: 'FeatureCollection',
      features: data
    });
    */
  });
}

/**
 * TODO
 * Find features in polygon.
 */
function findFeaturesWithinPolygon(req, res, next) {
}

/**
 * TODO
 * Find features in circle.
 */
function findFeaturesWithinCircle(req, res, next) {
}
