'use strict';

var _ = require('lodash');
var vow = require('vow');
var Queue = require('vow-queue');
var Feature = require('../../storage/model/feature');

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

/**
 * Creates GeoJSON Features and save them to MongoDB.
 * @function
 * @name saveFeatures
 * @param {Number} num Number of Features to create
 * @returns {Object}
 */
exports.saveFeatures = function (num) {
  var queue = new Queue({ weightLimit : 100 });
  var tasks = [];
  var enqueue = function (task) {
    tasks.push(queue.enqueue(task, { priority: 1, weight: 1 }));
  };
  var createTask = function (i) {
    return function () {
      var defer = vow.defer();
      var feature = new Feature(exports.createFeature());

      feature.save(function (err, feature) {
        defer.notify('saving feature: ' + i);
        if(err) {
          defer.reject(err);
        }
        else {
          defer.resolve(feature._id + '');
        }
      });

      return defer.promise();
    };
  };
  var getProgress = function (num) {
    return Math.round(num * 100 / tasks.length);
  };

  for(var i = 0; i < num; i++) {
    enqueue(createTask(i));
  }

  queue.start();

  return vow.allResolved(tasks).then(function (results) {
    var features = [], errors = [];
    results.forEach(function (promise, index) {
      var value = promise.valueOf();

      if(promise.isFulfilled()) {
        features.push(value);
      }
      else {
        errors.push({
          index: index,
          reason: value
        });
      }
    });

    return {
      result: {
        "features": features.length
      },
      errors: errors
    };
  })
  .progress(function (message) {
    var stats = queue.getStats();

    return {
      message: message,
      processed: getProgress(stats.processedTasksCount),
      processing: getProgress(stats.processingTasksCount)
    };
  });

};
