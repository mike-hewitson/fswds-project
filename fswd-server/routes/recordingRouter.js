require('dotenv').config();
var express = require('express'),
    bodyParser = require('body-parser'),
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
    });

myLogger.transports.console.level = process.env.LOGGING || 'warn';

var Recordings = require('../models/recordings'),
    recordingRouter = express.Router();

recordingRouter.use(bodyParser.json());

recordingRouter.route('/')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Recordings.find({}, function(err, recording) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(recording);
        });
    })
    .post(function(req, res, next) {
        Recordings.create(req.body, function(err, recording) {
            /* istanbul ignore if */
            if (err) {
                myLogger.error(err);
                myLogger.error(req.body);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Validation error on recording');
                // throw err;
            } else {
                console.log('recording created!');
                var id = recording.geyser_id;

                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the recording with id: ' + id);
            }
        });
    })
    .delete(function(req, res, next) {
        Recordings.remove({}, function(err, resp) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(resp);
        });
    });

recordingRouter.route('/currentstate/:geyserId')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        var query = Recordings.find({ "geyser_id": req.params.geyserId }).limit(1).sort({ $natural: -1 });
        query.exec(function(err, recording) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(recording);
        });
    });

recordingRouter.route('/today/:geyserId')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        var rightNow = new Date();
        var newDate = new Date(rightNow.getTime() - (24 * 60 * 60) * 1000);
        var query = Recordings.find({
            "geyser_id": req.params.geyserId,
            "measurement_time": { $gt: newDate }
        });
        query.exec(function(err, recordings) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(recordings);
        });
    });

recordingRouter.route('/byday/:querydate')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        var fromDate = new Date(req.params.querydate);
        var toDate = new Date(fromDate.getTime() + (24 * 60 * 60) * 1000);
        var query = Recordings.find({
            "geyser_id": "MainGeyser",
            "measurement_time": { $gte: fromDate, $lt: toDate }
        });
        query.exec(function(err, recordings) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(recordings);
        });
    });

module.exports = recordingRouter;
