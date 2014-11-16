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

/**
 * Express.Router param middleware.
 * Gets feature by Id.
 */
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
 * Gets feature
 * @function
 * @name getFeature
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next Express middleware callback
 */
function getFeature(req, res, next) {
  res.status(200).json(req.feature);
}

/**
 * Finds features
 * @function
 * @name findFeatures
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next Express middleware callback
 */
function findFeatures(req, res, next) {
}

/**
 * Creates feauture
 * @function
 * @name createFeature
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next Express middleware callback
 */
function createFeature(req, res, next) {
  var feature = new Feature(req.body);

  feature.save(function (err, feature) {
    if(err) {
      return next(err);
    }

    res.status(201).json(feature);
  });
}

/**
 * Updates feature
 * @name updateFeature
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next Express middleware callback
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
 * Removes feature
 * @name removeFeature
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next Express middleware callback
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
