'use strict';

var inherit = require('inherit');

/**
 * Coordinates <-> QuadKey convertor.
 * Represents XY coordinates as one-dimensional base-4 number.
 * @see http://msdn.microsoft.com/en-us/library/bb259689.aspx
 * @class
 * @name TileSystem
 */
var TileSystem = inherit({
  /**
   * @constructor
   * @param {Object} options
   */
  __constructor: function (options) {
    this._options = options;
  },
  /**
   * Calculates QuadKey for Lat/Long coordinates pair.
   * @function
   * @name TileSystem.coordinatesToQuadKey
   * @param {Number[]} coordinates
   * @returns {String} Base-4 number as string.
   */
  coordinatesToQuadKey: function (coordinates) {
    var options = this._options;
    var maxZoom = this.__self.maxZoom;
    var globalPixels = options.projection.toGlobalPixels(coordinates, maxZoom);
    var tileNumber = this.globalPixelsToTileNumber(globalPixels);

    return this.tileNumberToQuadKey(tileNumber, maxZoom);
  },
  /**
   * Converts global pixels coordinates to tile number.
   * @function
   * @name TileSystem.globalPixelsToTileNumber
   * @param {Number[]} globalPixels
   * @returns {Number[]} Tile XY Coordinates.
   */
  globalPixelsToTileNumber: function (globalPixels) {
    var tileSize = this.__self.tileSize;

    return [
      Math.floor(globalPixels[0] / tileSize),
      Math.floor(globalPixels[1] / tileSize)
    ];
  },
  /**
   * Converts QuadKey to tile number.
   * @function
   * @name TileSystem.quadKeyToTileNumber
   * @param {String} quadKey
   * @returns {Number[]} Tile XY coordinates.
   */
  quadKeyToTileNumber: function (quadKey) {
    var tileX = 0;
    var tileY = 0;
    var zoom = quadKey.length;
    var minZoom = this.__self.minZoom;

    for(var i = zoom; i > minZoom; i--) {
      var mask = 1 << (i - 1);

      switch(quadKey[zoom - i]) {
        case '0':
          break;
        case '1':
          tileX |= mask;
          break;
        case '2':
          tileY |= mask;
          break;
        case '3':
          tileX |= mask;
          tileY |= mask;
          break;
        default:
          throw new RangeError('Invalid QuadKey digit sequence.');
      }
    }

    return [tileX, tileY];
  },
  /**
   * Converts tile number to QuadKey.
   * @function
   * @name TileSystem.tileNumberToQuadKey
   * @param {String} quadKey
   * @param {Number[]} Tile XY coordinates.
   * @param {Number} zoom Level of zoom.
   * @returns {String} QuadKey.
   */
  tileNumberToQuadKey: function (tileNumber, zoom) {
    var quadKey = [];
    var tileX = tileNumber[0];
    var tileY = tileNumber[1];
    var minZoom = this.__self.minZoom;

    for(var i = zoom; i >= minZoom; i--) {
      var digit = 0;
      // var mask = 1 << (i - 1);
      var mask = 1 << i;

      if((tileX & mask) != 0) {
        digit++;
      }
      if((tileY & mask) != 0) {
        digit++;
        digit++;
      }
      quadKey.push(digit);
    }

    return quadKey.join('');
  }
}, /** @static */{
  tileSize: 256,
  minZoom: 0,
  maxZoom: 23
});

module.exports = TileSystem;
