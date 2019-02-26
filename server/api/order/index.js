'use strict';

var express = require('express');
var controller = require('./order.controller');
var router = express.Router();

//Sub routes of client module
router.post('/', controller.index);
router.post('/import', controller.importOrder);

module.exports = router;