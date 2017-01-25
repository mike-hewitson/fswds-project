// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var recordingSchema = new Schema({
    geyser_id: {
        type: String,
        required: true
    },
    measurement_time: {
        type: Date,
        required: true
    },
    heating_state: {
        type: Boolean,
        required: true
    },
    temperature: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    temperature_target: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    energy_used: {
        type: Number,
        min: 0,
        max: 10000,
        required: true
    }
}, {
    timestamps: false,
    versionKey: false
});

// the schema is useless so far
// we need to create a model using it
var Recordings = mongoose.model('Recordings', recordingSchema);

// make this available to our Node applications
module.exports = Recordings;
