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

var Settings = require('../models/settings');
var settingRouter = express.Router();

settingRouter.use(bodyParser.json());

settingRouter.route('/')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Settings.find({}, function(err, setting) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(setting);
        });
    })
    .post(function(req, res, next) {

        Settings.create(req.body, function(err, setting) {
            /* istanbul ignore if */
            if (err) {
                myLogger.error(err);
                myLogger.error(req.body);
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.end('Validation error on setting');
                // throw err;
            } else {
                console.log('setting created!');
                var id = setting._id;

                res.writeHead(201, {
                    'Content-Type': 'text/plain'
                });
                res.end('Added the setting with id: ' + id);
            }
        });
    })
    .delete(function(req, res, next) {
        Settings.remove({}, function(err, resp) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(resp);
        });
    });

settingRouter.route('/:id')
    .all(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    })
    .get(function(req, res, next) {
        Settings.findById(req.params.id , function(err, setting) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(setting);
        });
    })
    .put(function(req, res, next) {
        myLogger,debug(req.params.id);
        myLogger,debug(req.body);
        Settings.findByIdAndUpdate(req.params.id , {
            $set: req.body
        }, {
            new: true
        }, function(err, setting) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(setting);
        });
    })
    .delete(function(req, res, next) {
        Settings.findByIdAndRemove(req.params.id, function(err, resp) {
            /* istanbul ignore if */
            if (err) throw err;
            res.json(resp);
        });
    });


module.exports = settingRouter;
