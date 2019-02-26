/**
 * Code to Populate DB with dummy data on starting the server
 */

'use strict';

var chalk = require('chalk');

function start(req, res, next) {
    //Require Client Collection 
    var Client = require('../../api/client/client.model');

    Client.find(function(err, data) {
        if (err)
            console.log(chalk.red('Hey! %s Error occured while Populating clients'), process.env.USER);
        if (data.length < 1) {
            Client.create({
                "firstName": 'Petey',
                "lastName": 'Cruiser    '
            }, {
                "firstName": 'Anna',
                "lastName": 'Sthesia'
            }, {
                "firstName": 'Paul',
                "lastName": 'Molive'
            }, function(clientError, clients) {
                if (clientError) {
                    console.log(chalk.red('Hey! %s Error occured while populating clients'), process.env.USER);
                } else {
                    console.log(chalk.greenBright('Hey! %s Clients has been populated in database'), process.env.USER);
                }
            });
        } else {
            console.log(chalk.greenBright('Hey! %s Clients has been already there in database..'), process.env.USER);
        }

    });

}

exports.start = start;