(function() {
    'use strict';
    var mongoose = require('mongoose'),
        Services = require('../../service'),
        ENUMS = require('../../enums'),
        _ = require('lodash'),
        AutoIncrement = require('mongoose-sequence')(mongoose),
        Schema = mongoose.Schema,
        RequestSchema = new Schema({
            _id: { type: Number }, //Client ID
            clientId: { type: Number, required: true },
            requestId: { type: String, required: true },
            hours: { type: Number, required: true }
        }, { timestamps: true });

    RequestSchema.plugin(AutoIncrement, { id: ENUMS.TODO_APP_DB_COLLECTIONS.REQUEST.name });

    module.exports = mongoose.connections[Services.getObjectIndex(mongoose.connections, "name", process.env.TODO_APP_DB_NAME)]
        .model(ENUMS.TODO_APP_DB_COLLECTIONS.REQUEST.name, RequestSchema, ENUMS.TODO_APP_DB_COLLECTIONS.REQUEST.name);
}());