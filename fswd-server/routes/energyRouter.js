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

recordingRouter.route('/daily/:geyserId')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        myLogger.debug(req);
        var query = Recordings.aggregate([{
            "$match": {
                "geyser_id": { "$eq": req.params.geyserId }
            }
        }, {
            $project: {
                _id: 0,
                energy_used: 1,
                yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$measurement_time" } }
            }
        }, {
            "$group": {
                "_id": {
                    "date": "$yearMonthDay"
                },
                "daily_energy": {
                    "$sum": "$energy_used"
                }
            }
        }, {
            $sort: { "_id.date": 1 }
        }]);

        query.exec(function(err, energy) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(energy);
        });
    });

recordingRouter.route('/weekly/:geyserId')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        myLogger.debug(req);
        var query = Recordings.aggregate([{
            "$match": {
                "geyser_id": { "$eq": req.params.geyserId }
            }
        }, {
            $project: {
                _id: 0,
                energy_used: 1,
                measurement_time: 1,
                // yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$measurement_time" } }
                week: { $week: "$measurement_time" },
                yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$measurement_time" } }
            }
        }, {
            "$group": {
                "_id": {
                    "date": "$week"
                },
                "week_start": {
                    "$min": "$yearMonthDay"
                },
                "weekly_energy": {
                    "$sum": "$energy_used"
                }
            }
        }, {
            $sort: { "week_start": 1 }
        }]);

        query.exec(function(err, energy) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(energy);
        });
    });

module.exports = recordingRouter;
