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
var new_recording = {
    // "_id": "1234",
    "geyser_id": "Main Geyser",
    "measurement_time": "2016-11-10T08:31:13.158Z",
    "heating_state": true,
    "temperature": 45.6,
    "temperature_target": 58,
    "energy_used": 123.45
};

/*
 * Tests
 */
describe('Recordings', function() {
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

    describe('GET /recording', function() {
        it('respond with code 404 (wrong spelling)', function(done) {
            request(app)
                .get('/recording')
                .expect(HTTP_NOT_FOUND, done);
        });
    });

    describe('GET /recordings', function() {
        it('respond with code HTTP_OK + list of recordings', function(done) {
            request(app)
                .get('/recordings')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    expect(res.body).to.deep.equal(recordings_fixture);
                })
                .end(done);
        });
    });

    describe('DELETE /recordings', function() {
        it('responds with code HTTP_OK', function(done) {
            request(app)
                .delete('/recordings')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, { ok: 1, n: 5 });
                })
                .end(done);
        });
    });

    describe('POST /recordings', function() {
        it('HTTP_CREATED + data content', function(done) {
            request(app)
                .post('/recordings')
                .set('Accept', 'application/json')
                .send(new_recording)
                .expect(HTTP_CREATED)
                .end(done);
        });
    });

    describe('GET /recordings/currentstate/Main Geyser', function() {
        it('respond with code HTTP_OK + the latest state of a geyser', function(done) {
            request(app)
                .get('/recordings/currentstate/MainGeyser')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    myLogger.debug("result :", res.body);
                    expect(res.body[0]).to.deep.equal(recordings_fixture[4]);
                    expect(res.body[0]).to.deep.property("geyser_id", "MainGeyser");
                })
                .end(done);
        });
    });
});
