'use strict';

var express = require('express');
var router = express.Router();

module.exports = router;

router.use('/features/within', require('./features-within'));
router.use('/features/near', require('./features-near'));
router.use('/features', require('./features'));
