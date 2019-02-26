/**
 * Code to Populate DB with dummy data on starting the server
 */

'use strict';

var chalk = require('chalk');

function start(req, res, next) {
    //Require Request Collection 
    var Request = require('../../api/butler/request.model');

    Request.find(function(err, data) {
        if (err)
            console.log(chalk.red('Hey! %s Error occured while Populating request'), process.env.USER);
        if (data.length < 1) {
            Request.create({
                clientId: 1,
                requestId: "xyz1",
                hours: 6,
            }, {
                clientId: 1,
                requestId: "xyz2",
                hours: 2,
            }, {
                clientId: 1,
                requestId: "xyz3",
                hours: 5,
            }, {
                clientId: 1,
                requestId: "xyz3",
                hours: 4,
            }, function(requestError, requests) {
                if (requestError) {
                    console.log(chalk.red('Hey! %s Error occured while populating requests'), process.env.USER);
                } else {
                    console.log(chalk.greenBright('Hey! %s Requests has been populated in database'), process.env.USER);
                }
            });
        } else {
            console.log(chalk.greenBright('Hey! %s requests has been already there in database..'), process.env.USER);
        }

    });

}

exports.start = start;