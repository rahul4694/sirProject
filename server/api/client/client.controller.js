'use strict';

var Services = require('../../service');
var Client = require('./client.model');
var async = require('async');

/***************************************************************************************************************************
 * list clients with pagination and filter
 * API /api/client/
 * METHOD POST 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.index = function(req, res) {
    var requested_where = Services._removeBlankKey(req.body.where);
    var orQueryFields = ["name"]; //Array of field on which user can search client
    var where;
    //Prepare mongo query to filter order data
    where = Services._buildFindQuery(requested_where, orQueryFields);

    _performQuery();

    function _performQuery() {
        // console.log("Query To be perform on user collection : ", where);
        if (!req.body.page) return Services._noContent(res, "Please provide page number");
        var sort = (req.body.sort) ? "-" + req.body.sort : '-updatedAt';
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 30;
        var skip = (req.body.page == 1) ? 0 : req.body.page * limit - limit;
        async.parallel({
            data: function(cb) {
                Client
                    .find(where)
                    .skip(skip)
                    .limit(limit)
                    .sort('-updatedAt')
                    .lean()
                    .exec(function(err, clients) {
                        cb(err, clients);
                    });
            },
            total: function(cb) {
                Services._getDocCount(Client, where, function(err, count) {
                    cb(err, count);
                })
            },
            limit: function(cb) {
                cb(null, limit);
            }
        }, function(err, results) {
            // console.log("results ::: ", err, results.length)
            if (err) return Services._handleError(res, err);
            return Services._response(res, results);
        });
    }

};
/***************************************************************************************************************************
 * create client in system
 * API /api/client/create
 * METHOD POST 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.create = function(req, res) {
    var clientData = req.body;

    var client = {
        firstName: clientData.firstName,
        lastName: clientData.lastName
    };
    
    var newClient = new Client(client);
    //Save new client into collection
    newClient.save(function(err, result) {
        if (err) return Services._validationError(res, err);
        return Services._response(res, result);
    });
}