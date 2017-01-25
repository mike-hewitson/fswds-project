'use strict';

angular.module('fridgesApp')
    .service('latestFactory', ['$resource', 'ENV', function($resource, ENV) {

        this.getLatestRecording = function() {
            return $resource(ENV.baseURL + 'recordings/currentstate/MainGeyser');
        };

        this.getSettings = function() {
            return $resource(ENV.baseURL + 'settings/:_id', null, {
                'update': {
                    method: 'PUT'
                },
                'query': {
                    method: 'GET',
                    isArray: true
                }
            });
        };
    }])
    .service('settingsFactory', ['$resource', 'ENV', function($resource, ENV) {

        this.getSettings = function() {
            return $resource(ENV.baseURL + 'settings/:_id', null, {
                'update': {
                    method: 'PUT'
                },
                'query': {
                    method: 'GET',
                    isArray: true
                }
            });
        };
    }])
    .service('energyFactory', ['$resource', 'ENV', function($resource, ENV) {

        this.getEnergyDaily = function() {
            return $resource(ENV.baseURL + 'energy/daily/MainGeyser', null, {
                'get': { method: 'get', isArray: true }
            });
        };

        this.getEnergyWeekly = function() {
            return $resource(ENV.baseURL + 'energy/weekly/MainGeyser', null, {
                'get': { method: 'get', isArray: true }
            });
        };
    }])
    .service('temperatureFactory', ['$resource', 'ENV', function($resource, ENV) {

        this.getRecordings = function() {
            return $resource(ENV.baseURL + 'recordings/today/MainGeyser', null, {
                'get': { method: 'get', isArray: true }
            });
        };

        this.getRecordingsByDay = function() {
            return $resource(ENV.baseURL + 'recordings/byday/:querydate', null, {
                'get': { method: 'get', isArray: true }
            });
        };
    }]);
