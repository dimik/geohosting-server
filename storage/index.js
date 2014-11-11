'use strict';

var url = require('url');
var mongoose = require('mongoose');
var config = require('../config').get('mongo');
var utils = require('../lib/utils');
var auth = config.username && {
  auth: config.username + ':' + config.password
};

module.exports = mongoose.createConnection(
  url.format(
    utils.extend({
      slashes: true,
      pathname: config.database
    }, config, auth)
  )
);
