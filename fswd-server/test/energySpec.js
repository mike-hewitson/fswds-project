require('dotenv').config();
var request = require('supertest'),
    assert = require('chai').assert,
    expect = require('chai').expect,
    mongoose = require('mongoose'),
    winston = require('winston'),
    myLogger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                json: true,
                expressFormat: true,
                colorize: true
            })
        ]
    }),
    app = require('../app'),
    Recordings = require('../models/recordings');

var STRICT_REST = true,
    // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
    HTTP_OK = 200,
    HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK,
    HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var recordings_fixture = require('./fixtures/recordings_fixture');
var energy_daily = [{ "_id": { "date": "2017-01-10" }, "daily_energy": 123.45 },
    { "_id": { "date": "2017-01-16" }, "daily_energy": 123.45 },
    { "_id": { "date": "2017-01-17" }, "daily_energy": 306.9 },
    { "_id": { "date": "2017-01-18" }, "daily_energy": 163.45 }
];
var energy_weekly = [
    { "_id": { "date": 2 }, "week_start": "2017-01-10", "weekly_energy": 123.45 },
    { "_id": { "date": 3 }, "week_start": "2017-01-16", "weekly_energy": 593.8 }
];
/*
 * Tests
 */
describe('Energy', function() {
    beforeEach(function(done) {
        Recordings.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
            // var difference = new Date() - new Date(recordings_fixture[9].date);
            // adjusted_recordings = recordings_fixture.map(function(element) {
            //     var new_date = new Date(new Date(element.date).getTime() + difference);
            //     var new_element = element;
            //     new_element.date = new_date.toJSON();
            //     return new_element;
            // });
            Recordings.insertMany(recordings_fixture, done);
        });
    });

    describe('GET /energy/daily/MainGeyser', function() {
        it('respond with code HTTP_OK + the latest state of a geyser', function(done) {
            request(app)
                .get('/energy/daily/MainGeyser')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    myLogger.debug("result :", res.body);
                    expect(res.body).to.deep.equal(energy_daily);
                    // expect(res.body).to.deep.property("geyser_id", "MainGeyser");
                })
                .end(done);
        });
    });

    describe('GET /energy/weekly/MainGeyser', function() {
        it('respond with code HTTP_OK + the latest state of a geyser', function(done) {
            request(app)
                .get('/energy/weekly/MainGeyser')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    myLogger.debug("result :", res.body);
                    expect(res.body).to.deep.equal(energy_weekly);
                    // expect(res.body).to.deep.property("geyser_id", "MainGeyser");
                })
                .end(done);
        });
    });
});
