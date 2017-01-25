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
    Settings = require('../models/settings');

var STRICT_REST = true,
    // change that to false depending on https://www.coursera.org/learn/server-side-development/lecture/bKtMl/exercise-video-rest-api-with-express-mongodb-and-mongoose/discussions/x1AZIu9SEeWB0QpuSDkq-Q
    HTTP_OK = 200,
    HTTP_CREATED = (STRICT_REST) ? 201 : HTTP_OK,
    HTTP_NOT_FOUND = 404;

/*
 * Data
 */
var settings_fixture = require('./fixtures/settings_fixture');
var new_setting = {
    "geyser_id": "MainGeyser",
    "heating_allowed": true,
    "temperature_target": 59,
    "heating_schedules": [{
        "time_on": "05:00:00.000Z",
        "time_off": "08:00:00.000Z"
    }]
};
var updated_setting = {
    "_id": "56f102d1c369bf0525c055f1",
    "geyser_id": "MainGeyser",
    "heating_allowed": false,
    "temperature_target": 63,
    "heating_schedules": [{
        "_id": "587deba2da6324a0e0139835",
        "time_on": "05:00:00.000Z",
        "time_off": "08:00:00.000Z"
    }]
};

/*
 * Tests
 */
describe('Settings', function() {
    beforeEach(function(done) {
        Settings.remove({}, function(err, res) { // don't use drop() as this will occasionnnaly raise a background operation error
            Settings.insertMany(settings_fixture, done);
        });
    });

    describe('GET /setting', function() {
        it('respond with code 404 (wrong spelling)', function(done) {
            request(app)
                .get('/setting')
                .expect(HTTP_NOT_FOUND, done);
        });
    });

    describe('GET /settings', function() {
        it('respond with code HTTP_OK + list of settings', function(done) {
            request(app)
                .get('/settings')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(HTTP_OK)
                .expect(function(res) {
                    expect(res.body).to.deep.equal(settings_fixture);
                })
                .end(done);
        });
    });

    describe('DELETE /settings', function() {
        it('responds with code HTTP_OK', function(done) {
            request(app)
                .delete('/settings')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, { ok: 1, n: 2 });
                })
                .end(done);
        });
    });

    describe('POST /settings', function() {
        it('HTTP_CREATED + data content', function(done) {
            request(app)
                .post('/settings')
                .set('Accept', 'application/json')
                .send(new_setting)
                .expect(HTTP_CREATED)
                .end(done);
        });
    });

    describe('GET /settings/56f102d1c369bf0525c055f1', function() {
        it('respond with code HTTP_OK + the current settings', function(done) {
            request(app)
                .get('/settings/56f102d1c369bf0525c055f1')
                .set('Accept', 'application/json')
                .expect(HTTP_OK)
                .expect('Content-Type', /json/)
                .expect(function(res) {
                    myLogger.debug("result :", res.body[0]);
                    expect(res.body).to.deep.equal(settings_fixture[1]);
                    expect(res.body).to.deep.property("geyser_id", "MainGeyser");
                })
                .end(done);
        });
    });

    describe('PUT /settings/56f102d1c369bf0525c055f1', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .put('/settings/56f102d1c369bf0525c055f1')
                .set('Accept', 'application/json')
                .send(updated_setting)
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.equal(res.body.geyser_id, "MainGeyser");
                    // assert.isAtLeast(Date(res.body.date), updated_setting.heating_allowed);
                    assert.deepEqual(res.body, updated_setting);
                })
                .end(done);
        });
    });

    describe('DELETE /settings/56f102d1c369bf0525c055f0', function() {
        it('respond with code HTTP_OK + data content', function(done) {
            request(app)
                .delete('/settings/56f102d1c369bf0525c055f0')
                .expect(HTTP_OK)
                .expect(function(res) {
                    assert.deepEqual(res.body, settings_fixture[0]);
                })
                .end(done);
        });
    });


});
