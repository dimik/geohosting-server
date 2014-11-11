'use strict';

var express = require('express');
var router = express.Router();

module.exports = router;

router.use('/v1', require('./v1'));
