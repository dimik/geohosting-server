'use strict';

var should = require('should');
var request = require('supertest');
var url = require('url');
var config = require('../config').get('server');
var Feature = require('../storage/model/feature');
var helper = require('./helper');
var host = url.format(config);

describe('Geohosting API', function () {

  var featureId;

  after(function (done) {
    Feature.findById(featureId, function (err, feature) {
      if(err || !feature) {
        return done(err);
      }

      feature.remove(done);
    });
  });

  describe('#createFeature', function () {
    it('should create feature', function (done) {
      request(host)
        .post(url)
        .set('ContentType', 'application/json')
        .send(helper.createFeature())
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

  describe('#getFeature', function () {
    it('should get feature data', function (done) {
      request(host)
        .get(url + '/' + featureId)
        .set('ContentType', 'application/json')
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
          var result = JSON.parse(res.text);

          result.should.have.properties(
            'id',
            'type',
            'geometry',
            'properties'
          );

          result.id.should.be.eql(featureId);

          done(err);
        });
    });
  });

});
