/**
 * Main application file
 */

'use strict';

// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var path = require('path');
var dotenv = require('dotenv').config( path.resolve(process.cwd(), './.env') );
var express = require('express');
var config = require('./config/environment');
var chalk = require('chalk');
var cors = require('cors');
// return console.log("config", config);

require('./config/connections')

// Setup server
var app = express();
var server = require('http').createServer(app);
app.use(cors());
require('./config/express')(app);
require('./routes')(app);
// Start server
server.listen(config.port, config.ip, function () {
 console.log(chalk.greenBright('Hey! %s Todo App server listening on http://%s:%d, in %s mode'), process.env.USER, config.ip, config.port, app.get('env'));
});

process.on('uncaughtException', function(err) {
    console.log('Global uncaughtException', err);
})

// Expose app
exports = module.exports = app;
