/**
 * Code to Populate DB with dummy data on starting the server
 */

'use strict';

var client = require('./client');

function start() {
    client.start();
}

exports.start = start;