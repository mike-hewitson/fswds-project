"use strict";

require('dotenv').config();
var request = require('request'),
    winston = require('winston'),
    myLogger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                expressFormat: true,
                colorize: true
            })
        ]
    });
myLogger.transports.console.level = process.env.LOGGING || 'warn';

var url = 'http://' + process.env.REST_SERVER + ':' + process.env.REST_PORT + '/recordings/currentstate/MainGeyser';
var req = {
    url: url,
    method: "get",
    headers: {
        "content-type": "application/json"
    }
};

request(req, function(error, response, body) {
    if (response.statusCode === 200) {
        var url = 'http://' + process.env.REST_SERVER + ':' + process.env.REST_PORT + '/settings?_id=587f9ce8bb7d3d3b0a371b24';
        var req = {
            url: url,
            method: "get",
            headers: {
                "content-type": "application/json"
            }
        };
        request(req, function(error, response, settings) {
            if (response.statusCode === 200) {
                var geyserSettings = JSON.parse(settings);
                var oldRecord = JSON.parse(body);
                var newRecord = {};
                var oldDate = new Date(oldRecord[0].measurement_time);
                var newDate = new Date(oldDate.getTime() + 10 * 60000);
                myLogger.debug(geyserSettings);

                newRecord.geyser_id = oldRecord[0].geyser_id,
                    newRecord.measurement_time = newDate,
                    // drop water temperature by 20% per day of the temp diff between ambient and geyser
                    newRecord.temperature = oldRecord[0].temperature - (oldRecord[0].temperature - 20) * 0.2 / 24 / 6,
                    newRecord.temperature_target = geyserSettings[0].temperature_target,
                    newRecord.energy_used = 0,
                    newRecord.heating_state = false;

                // increase energy by 3kw for 10min, and increase temp by 17.4 deg/hour for 10 mins
                if (oldRecord[0].heating_state) {
                    newRecord.energy_used += 3000 / 60 * 10;
                    newRecord.temperature += 17.4 / 6;
                }

                // todo allow for solar heat

                // mike shower (uses 1/4 geyser)
                if ((newDate.getHours() == 5) && (newDate.getMinutes() >= 30) && (newDate.getMinutes() < 40)) {
                    newRecord.temperature = oldRecord[0].temperature * 0.75 + 18 * 0.25;
                }


                // bridget shower (uses 40% geyser)
                if ((newDate.getHours() == 8) && (newDate.getMinutes() >= 0) && (newDate.getMinutes() < 10)) {
                    newRecord.temperature = oldRecord[0].temperature * 0.5 + 18 * 0.40;
                }


                var schedules = geyserSettings[0].heating_schedules;
                var newMins = newDate.getHours() * 60 + newDate.getMinutes();
                var newOn = parseInt(schedules[0].time_on.substr(0, 2)) * 60 + parseInt(schedules[0].time_on.substr(0, 2));
                var newOff = parseInt(schedules[0].time_off.substr(0, 2)) * 60 + parseInt(schedules[0].time_off.substr(0, 2));

                // check schedule
                if (schedules.length > 0) {
                    if (newMins >= newOn && newMins <= newOff) {
                        myLogger.debug("in schedule");
                        // if temperature difference is greater than two degrees, switch heating on
                        if (geyserSettings[0].heating_allowed &&
                            ((newRecord.temperature + 2) < newRecord.temperature_target)) {
                            newRecord.heating_state = true
                        }
                    } else {
                        myLogger.debug("out of schedule");
                    }
                } else {
                    myLogger.error("No schedule");
                }

                myLogger.debug("new record:", newRecord);

                var url = 'http://' + process.env.REST_SERVER + ':' + process.env.REST_PORT + '/recordings';
                var req = {
                    url: url,
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    },
                    json: newRecord
                };


                request(req, function(error, response, body) {
                    if (response.statusCode === 201) {
                        myLogger.info("Added record succesfully for :", newDate);
                        process.exit();
                    } else {
                        myLogger.error(response.statusCode);
                        myLogger.error(body);
                        process.exit(1);
                    }
                });

            } else {
                myLogger.error(response.statusCode);
                myLogger.error(body);
                process.exit(1);
            }
        });
    } else {
        myLogger.error(response.statusCode);
        myLogger.error(body);
        process.exit(1);
    }
});
