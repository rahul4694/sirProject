(function() {
    "use strict";

    var mongoose = require('mongoose');
    var chalk = require('chalk');
    var config = require('./environment');
    var Services = require('../service');
    var request = require('request');
    var seed = require('./seed');
    /*==================================================================================================
     Connect to database
    ==================================================================================================*/
    // console.log("config.mongo.TODO_APP_DB : ", config.mongo.TODO_APP_DB);
    mongoose.connect(config.mongo.TODO_APP_DB, config.mongo.options);

    mongoose.connection.on('connected', function() {
        console.log(chalk.yellowBright('Database Connection Active'));
        if (config.mongo.seedDB == 'true') {
            // Populate database with sample data
            seed.start();
        }
    });

    mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        //Node Process Exit if there is an error while establishing connection between app and database
        process.exit(-1);
    });


}());