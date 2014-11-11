'use strict';

var express = require('express');
var router = express.Router();

module.exports = router;

router.route('/')
  .get(getFeaturesNear);

function getFeaturesNear(req, res, next) {
}
