'use strict';

var Services = require('../../service');
var Request = require('./request.model');
var _ = require("lodash");

/***************************************************************************************************************************
 * create request in system
 * API /api/butler/request/create
 * METHOD POST 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.create = function(req, res) {
    const request = new Request({
        clientId:     req.body.clientId,
        requestId:    req.body.requestId,
        hours:        req.body.hours,
    });
    request.save()
        .then(function(newRequest) {
            return Services._response(res, newRequest, "Resource Allocated Successfully");
        }).catch(function(err) {
            return Services._handleError(res, err);
        })
}

/***************************************************************************************************************************
 * Getting the Resource Allocation Information
 * API /api/butler/allocateAndReport
 * METHOD GET 
 * Secuirty -> Open
 **************************************************************************************************************************/
exports.allocateAndReport = function(req, res) {
    Request.find({}).then(function(response){
        let data = Object.assign([], response);
        let butlers = [];

        //Finding the unique Client IDs
        let spreadClientIds = _.uniq(_.map(response, 'clientId'))
        for (let i = 0; i < data.length; i++) {
            let { newData, requests } = assignButler(data);
            butlers.push({
                "requests": requests
            });
            data = newData ? Object.assign([], newData) : [];
        }

        var respond = {
            butlers: butlers,
            spreadClientIds: spreadClientIds
        }

        return Services._response(res, respond);
    })

    // Assigning the Buttler to Each Process of 8 Hour
    function assignButler(data) {
        let maxHours = 8;
        let currentHours = 0;
        let requests = [];
        let newData = Object.assign([], data);
        for (let i = 0;
            (currentHours <= maxHours) && i < newData.length; i++) {
            const item = _.maxBy(data, "hours")
            if (item.hours <= maxHours) {
                currentHours += item.hours;
                requests.push(item.requestId);
            }

            // Removing the Allocated Resource Request
            var index = data.findIndex(function(element) {
                return element.hours === item.hours;
            })
            if (index !== -1) {
                data.splice(index, 1)
            }
        }
        return { data, requests };
    }

}