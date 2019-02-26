/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

    // Insert routes below
    app.use('/api/client', require('./api/client'));
    app.use('/api/order', require('./api/order'));
    
    // All undefined asset or api routes should return a 404
    app.route('/:url(api|components|)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    app.route('/*')
        .get(function(req, res) {
            if (process.env.NODE_ENV == "development")
                res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
            if (process.env.NODE_ENV == "production")
                res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};