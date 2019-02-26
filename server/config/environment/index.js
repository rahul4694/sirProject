'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}
// All configurations will extend these options
// ============================================
var all = {
    env: (process.env.NODE_ENV) ? process.env.NODE_ENV : requiredProcessEnv('NODE_ENV'),

    // Root path of server
    root: path.normalize(__dirname + '/../../..'),

    //Swagger host domain
    swaggerHost: process.env.SWAGGER_HOST
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});