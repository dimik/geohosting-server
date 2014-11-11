'use strict';

var inherit = require('inherit');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * Simple Logger
 * @class
 * @name Logger
 * @augments EventEmitter
 */
var Logger = inherit(EventEmitter, {
  /**
   * @constructor
   * @function
   * @param {Object} [options] Logger options
   */
  __constructor: function (options) {
    this._options = options;
    this._setupLevels();
  },
  /**
   * Write value to log.
   * @function
   * @name Logger.log
   * @param {String} [level=debug] Log level.
   */
  log: function (level, value) {
    if(arguments.length === 1) {
      value = level;
      level = 'debug';
    }
    var message = this.getMessage(value);
    this.emit(level, message);
    util.log(util.format('[%s] - %s', level, message));
  },
  /**
   * Returns string representation of logging value.
   * @function
   * @name Logger.getMessage
   * @param {*} value Instance of error or any value.
   * @returns {Stirng} message
   */
  getMessage: function (value) {
    return value instanceof Error?
      util.inspect(value) : JSON.stringify(value);
  },
  /**
   * Creates method for each log level.
   * @function
   * @private
   * @name Logger._setupLevels
   */
  _setupLevels: function () {
    this.__self.levels.forEach(function (level) {
      this[level] = this.log.bind(this, level);
    }, this);
  }
}, {
  /**
   * Log levels.
   * @static
   */
  levels: [
    'debug',
    'info',
    'notice',
    'warning',
    'err',
    'crit',
    'alert',
    'emerg'
  ]
});

module.exports = new Logger();
