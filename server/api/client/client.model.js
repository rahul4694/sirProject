(function() {
    'use strict';
    var mongoose = require('mongoose'),
        Services = require('../../service'),
        ENUMS = require('../../enums'),
        _ = require('lodash'),
        AutoIncrement = require('mongoose-sequence')(mongoose),
        Schema = mongoose.Schema,
        ClientSchema = new Schema({
            _id: { type: Number }, //Client ID
            name: { type: String },
            firstName: { type: String },
            lastName: { type: String },
        }, { timestamps: true });

    ClientSchema.plugin(AutoIncrement, { id: ENUMS.TODO_APP_DB_COLLECTIONS.CLIENT.name });

    /***************************************************************************************************************************
     * Validations
     **************************************************************************************************************************/
    ClientSchema
        .path('firstName')
        .validate(function(firstName) {
            return firstName.length;
        }, 'First name cannot be blank');

    ClientSchema
        .path('lastName')
        .validate(function(lastName) {
            return lastName.length;
        }, 'Last name cannot be blank');

    /***************************************************************************************************************************
     * Pre-save hook
     **************************************************************************************************************************/
    ClientSchema
        .pre('save', function(next) {
            var self = this;
            self.name = self.firstName + " " + self.lastName;
            self.name = self.name.replace(/\b[a-z]/g, function(f) { return f.toUpperCase() })
            next();
        });

    module.exports = mongoose.connections[Services.getObjectIndex(mongoose.connections, "name", process.env.TODO_APP_DB_NAME)]
        .model(ENUMS.TODO_APP_DB_COLLECTIONS.CLIENT.name, ClientSchema, ENUMS.TODO_APP_DB_COLLECTIONS.CLIENT.name);
}());