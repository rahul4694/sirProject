'use strict';

var express = require('express');
var controller = require('./client.controller');
var router = express.Router();

//Sub routes of client module
router.post('/', controller.index);
router.post('/create', controller.create);

module.exports = router;