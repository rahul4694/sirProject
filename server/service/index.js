'use strict';
/***************************************************************************************************************************

 * Shared Service use by diffent controllers 
 
 **************************************************************************************************************************/
var path = require('path');
var _ = require('lodash');
var NETWORK_SERVICE = require('./network');
// All Service will extend these Service
// ============================================
var COMMON_SERVICES = {
    //get index of object in array (ES6)
    getObjectIndex: function(array, key, value) {
        return array.findIndex(ind => ind[key] == value);
    },

    //Request NPM options
    _requestOptions: function() {

        var options = {
            baseUrl: '',
            uri: '',
            method: "POST"
        }

        return options;
    },

    // Build mongoDB find query
    _buildFindQuery: function(where, options) {
        // if (!source) return "Invaild source";
        if (!where && typeof where != 'object') return cb("Invaild query", null);

        var query = {}
        var self = this;
        _.forEach(where, function(value, key, obj) {
            if (key == "q") {
                // console.log("q  running....");
                query['$or'] = self._buildOrQuery(options, value);
            } else if (value instanceof Array) {
                query[key] = { "$in": value }
            } else {
                query[key] = value;
            }
        });
        return query;
    },

    // Get Count of doc present in mongoDB
    _getDocCount: function(collection, where, cb) {
        if (!cb && typeof cb != 'function') return "Invaild callback";
        if (!collection) return cb("Provide collection", null);
        if (!where && typeof where != 'object') return cb("Invaild query", null);
        collection.find(where).count().exec(function(err, count) {
            if (!err && count > 0) {
                return cb(err, count)
            } else {
                return cb(err, 0);
            }
        });
    },

    // Build mongoDB or query
    _buildOrQuery: function(options, value) {
        var OrQuery = [];
        var Regxexpression = new RegExp(value, "i");
        _.forEach(options, function(field) {
            var orField = {};
            orField[field] = Regxexpression;
            OrQuery.push(orField);
        });
        return OrQuery;
    },

    //Remove blank field of an object
    _removeBlankKey: function(where) {
        var filters = JSON.parse(JSON.stringify(where));
        _.forEach(filters, function(value, key, obj) {
            // if (!filters[key] || filters[key].length == 0 || filters[key] == null || filters[key] == undefined)
            if (filters[key] == null || filters[key] == undefined || filters[key].length == 0)
                delete filters[key];
        });
        return filters;
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    COMMON_SERVICES,
    NETWORK_SERVICE
);