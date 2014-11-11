'use strict';

var nconf = require('nconf');

nconf
  .argv()
  .env('_');

nconf.file('local', __dirname + '/local.json');
nconf.file('global', __dirname + '/global.json');

nconf.defaults({
  "server": {
    "protocol": "http",
  },
  "mongo": {
    "protocol": "mongodb",
    "slashes": true
  }
});

module.exports = nconf;
