'use strict';

var express = require('express');
var controller = require('./butler.controller');
var router = express.Router();

//Sub routes of bulter module
router.get('/allocateAndReport', controller.allocateAndReport);
router.post('/request/create', controller.create);

module.exports = router;