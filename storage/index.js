'use strict';

var _ = require('lodash');
var url = require('url');
var mongoose = require('mongoose');
var config = require('../config').get('mongo');
var auth = config.username && {
  auth: config.username + ':' + config.password
};

module.exports = mongoose.createConnection(
  url.format(
    _.extend({
      pathname: config.database
    }, config, auth)
  )
);
