'use strict';

var should = require('should');
var request = require('supertest');
var url = require('url');
var config = require('../config').get('server');
var _ = require('lodash');
var Feature = require('../storage/model/feature');
var host = url.format(config);

describe('Geohosting API', function () {

  var url = '/api/v1/features';
  var data = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [ _.random(-180, 180 - 1e-10, true), _.random(-85, 85, true) ]
    },
    properties: {
      balloonContent: 'Содержимое балуна',
      hintContent: 'Содержимое всплывающей подсказки'
    }
  };
  var featureId;

  after(function (done) {
    Feature.findById(featureId, function (err, feature) {
      if(err || !feature) {
        return done(err);
      }

      feature.remove(done);
    });
  });

  describe('#addFeature', function () {
    it('should add feature', function (done) {
      request(host)
        .post(url)
        .set('ContentType', 'application/json')
        .send(data)
        .expect("Content-Type", /json/)
        .expect(201)
        .end(function (err, res) {
          var result = JSON.parse(res.text);

          result.should.have.properties(
            'id',
            'type',
            'geometry',
            'properties'
          );

          featureId = result.id;

          done(err);
        });
    });
  });

});
