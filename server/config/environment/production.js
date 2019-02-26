'use strict';

// Production specific configuration
// ==================================
module.exports = {
    // Server IP
    ip: process.env.IP || '0.0.0.0',

    // Server port
    port: process.env.PORT || 3000,

    // MongoDB connection options
    mongo: {
        TODO_APP_DB: 'mongodb://' + process.env.TODO_APP_DB_HOST + '/' + process.env.TODO_APP_DB_NAME,
        options: {
            db: {
                numberOfRetries: 5,
                safe: true
            },
            server: {
                poolSize: 300,
                socketOptions: {
                    keepAlive: 120
                },
                reconnectInterval: 2000,
                reconnectTries: Number.MAX_VALUE
            },
        },
        // Should we populate the DB with sample data?
        seedDB: process.env.SEED_DB || false,

        swaggerDocumentationLicenseURL: process.env.SWAGGER_DOCUMENTATION_LICENSE_URL
    }
};