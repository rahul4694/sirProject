(function() {
    'use strict';
    var mongoose = require('mongoose'),
        Services = require('../../service'),
        ENUMS = require('../../enums'),
        _ = require('lodash'),
        AutoIncrement = require('mongoose-sequence')(mongoose),
        Schema = mongoose.Schema,
        OrderSchema = new Schema({
            _id: { type: Number }, //Order ID
            clientID: { type: Number, ref: ENUMS.TODO_APP_DB_COLLECTIONS.CLIENT.name },
            request: { type: String },
            duration: { type: Number },
        }, { timestamps: true });

    OrderSchema.plugin(AutoIncrement, { id: ENUMS.TODO_APP_DB_COLLECTIONS.ORDER.name });

    /***************************************************************************************************************************
     * Pre-save hook
     **************************************************************************************************************************/


    module.exports = mongoose.connections[Services.getObjectIndex(mongoose.connections, "name", process.env.TODO_APP_DB_NAME)]
        .model(ENUMS.TODO_APP_DB_COLLECTIONS.ORDER.name, OrderSchema, ENUMS.TODO_APP_DB_COLLECTIONS.ORDER.name);
}());