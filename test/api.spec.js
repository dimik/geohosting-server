'use strict';

var should = require('should');
var request = require('supertest');
var vow = require('vow');
var _ = require('lodash');
var config = require('../config').get('server');
var Feature = require('../storage/model/feature');
var helper = require('./helper');
var host = require('url').format(config);
var url = '/api/v1/features';

describe('Geohosting API', function () {

  var featureId;
  var featureCustomId = 'feature-test-id';

  after(function (done) {
    vow.allResolved([
      Feature.findByIdAndRemove(featureId).exec(),
      Feature.findOneAndRemove({ id: featureCustomId }).exec()
    ]).done(function () {
      done();
    }, done);
  });

  describe('#createFeature', function () {
    var feature = helper.createFeature();

    it('should create feature', function (done) {
      request(host)
        .post(url)
        .set('ContentType', 'application/json')
        .send(feature)
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

    it('should create feature with custom id', function (done) {

      var feature = _.extend(helper.createFeature(), { id: featureCustomId });

      request(host)
        .post(url)
        .set('ContentType', 'application/json')
        .send(feature)
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

          result.id.should.be.eql(featureCustomId);

          done(err);
        });
    });

    it('should return error for feature with existing id', function (done) {

      var feature = _.extend(helper.createFeature(), { id: featureCustomId });

      request(host)
        .post(url)
        .set('ContentType', 'application/json')
        .send(feature)
        .expect("Content-Type", /json/)
        .expect(500)
        .end(function (err, res) {
          var result = JSON.parse(res.text);

          result.should.have.properties('data', 'error');

          result.error.should.match({
            status: 500,
            title: 'Internal Error',
            detail: /duplicate key error/ig
          });

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

    it('should get feature data by custom id', function (done) {
      request(host)
        .get(url + '/' + featureCustomId)
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

          result.id.should.be.eql(featureCustomId);

          done(err);
        });
    });

    it('should return 400 if feature not found', function (done) {
      request(host)
        .get(url + '/non-existing-feature-id')
        .set('ContentType', 'application/json')
        .expect("Content-Type", /json/)
        .expect(400)
        .end(function (err, res) {
          var result = JSON.parse(res.text);

          result.should.have.properties('data', 'error');

          result.error.should.have.properties({
            status: 400,
            title: 'Bad Request',
            detail: 'Feature not found'
          });

          done(err);
        });
    });
  });

  describe('#updateFeature', function () {
    var data = {
      properties: {
        balloonContent: 'New content'
      }
    };

    it('should update feature data', function (done) {
      request(host)
        .put(url + '/' + featureId)
        .set('ContentType', 'application/json')
        .send(data)
        .expect("Content-Type", /json/)
        .expect(204)
        .end(function (err, res) {

          Feature.findById(featureId).exec()
            .then(function (feature) {
              var result = feature.toJSON();

              result.id.toString().should.be.eql(featureId);
              result.properties.should.match(data.properties);
              done();
            }, done);
        });
    });

  });
});
