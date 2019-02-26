/**
 * Code to Populate DB with dummy data on starting the server
 */

'use strict';

var client = require('./client');
var request = require('./request');

function start() {
    client.start();
    request.start();
}

exports.start = start;