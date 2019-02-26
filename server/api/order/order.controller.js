'use strict';

var Services = require('../../service');
var Order = require('./order.model');
var Client = require('../client/client.model');
var _ = require('lodash');
var CSV = require("csvtojson");
var async = require('async');
var request = require('request');

/***************************************************************************************************************************
 * list orders with pagination and filter
 * API /api/order/
 * METHOD POST 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.index = function(req, res) {
    // console.log("req.body : ", req.body);
    var requested_where = Services._removeBlankKey(req.body.where);
    var orQueryFields = ["request"]; //Array of field on which user can search order
    var where = {};

    //Prepare mongo query to filter order data
    where = Services._buildFindQuery(requested_where, orQueryFields);

    //Execute query
    _performQuery();

    function _performQuery() {
        if (!req.body.page) return Services._noContent(res, "Please provide page number");
        var sort = (req.body.sort) ? "-" + req.body.sort : '-updatedAt';
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 30;
        var skip = (req.body.page == 1) ? 0 : req.body.page * limit - limit;
        async.parallel({
            data: function(cb) {
                Order
                    .find(where)
                    .populate({
                        path: 'clientID',
                        select: 'name'
                    })
                    .skip(skip)
                    .limit(limit)
                    .sort('-updatedAt')
                    .lean()
                    .exec(function(err, orders) {
                        cb(err, orders);
                    });
            },
            total: function(cb) {
                Services._getDocCount(Order, where, function(err, count) {
                    cb(err, count);
                })
            },
            limit: function(cb) {
                cb(null, limit);
            }
        }, function(err, results) {
            // console.log("results ::: ", err, results.length)
            if (err) return Services._handleError(req, res, err);
            return Services._response(res, results);
        });
    }

};
/***************************************************************************************************************************
 * Import orders from CSV file
 * API /api/order/import
 * METHOD POST 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.importOrder = function(req, res) {
    var csvURL = req.body.url;
    if (!csvURL) return Services._noContent(res, "Please provide csv file url");
    if (!(/\.(csv)$/i).test(csvURL)) return Services._validationError(res, "File extension", "Invaild csv file url");

    var totalOrder = 0;
    var orders = [];
    var clientIDs = [];

    //Read csv from URL
    CSV()
        .fromStream(request.get(csvURL))
        .subscribe((order) => {
            orders.push(order);
        }, onError, onComplete);


    //Handle Error while fetching data from CSV URl
    function onError(err) {
        // console.log("Error while fetching data from CSV URl : ", err)
        return Services._handleError(req, res, err);

    }

    //Handle CSV read complete
    function onComplete() {
        //Check if CSV data is valid
        if (_.size(orders[0]) != 3 || !_.has(orders[0], 'clientID') || !_.has(orders[0], 'request') || !_.has(orders[0], 'duration'))
            return Services._validationError(res, "File format", "Invaild data in csv file");

        //Total order read from CSV file
        totalOrder = orders.length;

        //Retrive all clientID from orders
        clientIDs = orders.map((v) => { return v.clientID });
        clientIDs = _.uniqBy(clientIDs);

        //Match the clientIDs from client collections
        Client.find({ _id: { '$in': clientIDs } })
            .select({ _id: 1 })
            .lean()
            .exec(function(error, clients) {
                if (error) return Services._handleError(req, res, error);

                //Filter orders whose client is present in client collection
                orders = _.filter(orders, (v) => { return _.find(clients, (a) => { return a._id == v.clientID }) });

                //Store imported client in order collection
                importOrderInCollection();
            })

    }

    //Import CSV data into collection
    function importOrderInCollection() {
        Order.create(...orders, function(error, done) {
            if (error) return Services._handleError(req, res, error);
            // console.log("%s Order is imported from csv file out of %s", orders.length, totalOrder);

            var response = {
                totalOrderInCSV: totalOrder,
                totalImportedOrder: orders.length
            }
            return Services._response(res, response)
        });
    }
}