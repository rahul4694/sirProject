/**
 * Express configuration
 */

'use strict';

var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require(config.root + '/swagger.json');
var rfs = require('rotating-file-stream');
var fs = require('fs');
var chalk = require('chalk');

module.exports = function(app) {
    var env = app.get('env');
    app.set('views', config.root + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.json({ limit: '20mb' }));
    app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
    app.use(methodOverride());
    app.use(cookieParser());

    // ensure log directory exists 
    var logDirectory = config.root + '/server/log';
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

    console.log(chalk.blueBright("Application logged at path : ", logDirectory));


    // create a rotating write stream for log files
    var accessLogStream = rfs('access.log', {
        interval: '7d', // rotate daily 
        path: logDirectory
    })

    //swagger settings
    var customCssHideSwggerHeade = '.swagger-ui .topbar { display: none !important }';
    var customfavIconSwagger = config.root + "/favicon.ico";

    swaggerDocument.host = config.swaggerHost + ":" + config.port;

    console.log("API Documentation URL : ", swaggerDocument.host);

    swaggerDocument.info.license.url = config.swaggerDocumentationLicenseURL;

    app.use(function(req, res, next) {
        req.requestInfo = {};
        req.requestInfo.ip = req.connection.remoteAddress;
        req.requestInfo.userAgent = req.get('User-Agent');
        next()
    })



    if ('production' === env) {
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', path.join(config.root, 'client'));
        app.use(morgan('combined', { stream: accessLogStream }));
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, null, null, customCssHideSwggerHeade, customfavIconSwagger, null, "API's Documentation - Platform HR"));

    }

    if ('development' === env) {
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, null, null, customCssHideSwggerHeade, customfavIconSwagger, null, "API's Documentation - Platform HR"));
        app.use(express.static(path.join(config.root, 'client')));
        app.set('appPath', path.join(config.root, 'client'));
        app.use(morgan('combined', { stream: accessLogStream }));
        app.use(errorHandler()); // Error handler - has to be last
    }
};