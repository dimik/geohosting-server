'use strict';

var should = require('should');
var TileSystem = require('../lib/tile-system');
var projection = require('../lib/projection');
var tileSystem = new TileSystem({
  projection: projection.create('wgs84Merkator')
});

describe('TileSystem', function () {
  describe('#quadKeyToTileNumber()', function () {
    it('should return tile number from QuadTree Key', function (done) {
      var result = tileSystem.quadKeyToTileNumber('0213');

      result.should.be.eql([3, 5]);
      done();
    });
  });
  describe('#tileNumberToQuadKey()', function () {
    it('should return QuadTree Key for tile number and zoom', function (done) {
      var zoom = 3;
      var result = tileSystem.tileNumberToQuadKey([3, 5], zoom);

      result.should.be.eql('0213');
      done();
    });
  });
  describe('#coordinatesToQuadKey()', function () {
    it('should return QuadTree Key for coordinates', function (done) {
      var coordinates = [37.573856, 55.751574];
      var result = tileSystem.coordinatesToQuadKey(coordinates);

      result.should.be.eql('012031010121110022221130');
      done();
    });
  });
});
