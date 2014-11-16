#!/bin/env node

var cluster = require('cluster');

if(cluster.isMaster) {
  require('./app-cluster');
}
else if(cluster.isWorker) {
  require('./app-worker');
}
