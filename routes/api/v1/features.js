'use strict';

var Feature = require(process.cwd() + '/storage/model/feature');

var express = require('express');
var router = express.Router();

module.exports = router;

router.route('/')
  .get(findFeatures)
  .post(addFeature);

router.route('/:feature')
  // .get(getFeature)
  .put(updateFeature)
  .delete(removeFeature);

router.param('feature', function (req, res, next, id) {
  Feature.findById(id).exec()
    .then(function (feature) {
      if(!feature) {
        return next(new Feature.NotFoundError());
      }
      req.feature = feature;
      next();
    }, next);
});

/**
 * Find features
 */
function findFeatures(req, res, next) {
}

/**
 * Add feauture
 */
function addFeature(req, res, next) {
  var feature = new Feature(req.body);

  feature.save(function (err, feature) {
    if(err) {
      return next(err);
    }

    res.status(201).json(feature);
  });
}

/**
 * Update feature
 */
function updateFeature(req, res, next) {
  var feature = req.feature;

  feature.set(req.body);
  feature.save(function (err) {
    if(err) {
      return next(err);
    }

    res.status(204).end();
  });
}

/**
 * Remove feature
 */
function removeFeature(req, res, next) {
  var feature = req.feature;

  feature.remove(function (err) {
    if(err) {
      return next(err);
    }

    res.status(204).end();
  });
}
