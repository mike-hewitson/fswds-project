// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    // _id: {
    //     type: Schema.Types.ObjectId,
    //     required: false
    // },
    time_on: {
        type: String,
        required: true
    },
    time_off: {
        type: String,
        required: true
    }
});

// create a schema
var settingSchema = new Schema({
    geyser_id: {
        type: String,
        required: true
    },
    heating_allowed: {
        type: Boolean,
        required: true
    },
    temperature_target: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    heating_schedules: [scheduleSchema]
}, {
    timestamps: false,
    versionKey: false
});

// the schema is useless so far
// we need to create a model using it
var Settings = mongoose.model('Settings', settingSchema);

// make this available to our Node applications
module.exports = Settings;
