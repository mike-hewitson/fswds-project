'use strict';

angular.module('fridgesApp')
    .controller('TemperatureChartCtrl', ['$scope', 'temperatureFactory', function($scope, temperatureFactory) {

        $scope.loadTemperatures = function() {
            $scope.showData = false;
            $scope.message = 'Loading ...';

            var cols = [
                { id: 'x', label: 'Date', type: 'datetime' },
                { id: 's', label: 'Temperature', type: 'number' },
                { id: 's', label: 'Desired Temp', type: 'number' },
                { id: 's', label: 'Heating', type: 'number' }
            ];

            // console.log("queryDate", $scope.queryDate);
            // console.log($scope.selection);

            if ($scope.selection == "last 24 hours") {
                temperatureFactory.getRecordings().get().$promise.then(
                    function(response) {
                        $scope.recordings = response;
                        $scope.showData = true;
                        $scope.message = '';

                        $scope.chartObject1 = {};
                        var rows = [];
                        for (var i = 0; i < $scope.recordings.length; i++) {
                            rows.push({
                                c: [{ v: new Date($scope.recordings[i].measurement_time) },
                                    { v: $scope.recordings[i].temperature.toFixed(1) },
                                    { v: $scope.recordings[i].temperature_target.toFixed(1) },
                                    { v: $scope.recordings[i].heating_state }
                                ]
                            });
                        }

                        $scope.chartObject1.type = 'LineChart';

                        $scope.chartObject1.data = {
                            'cols': cols,
                            'rows': rows
                        };

                        $scope.chartObject1.options = {
                            'title': 'MainGeyser - Daily Temperature/Heating Pattern',
                            series: {
                                0: { targetAxisIndex: 0, type: 'line', curveType: 'function' },
                                1: { targetAxisIndex: 0, type: 'line' },
                                2: { targetAxisIndex: 1, type: 'bar' }
                            },
                            vAxes: [
                                { title: 'Temperature' },
                                { title: 'Heating on/off' }
                            ]
                        };

                    },
                    /* istanbul ignore next */
                    function(response) {
                        $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
                    });
            } else {
                if (!$scope.queryDate) {
                    $scope.queryDate = new Date();

                };
                $scope.queryDate = new Date($scope.queryDate.setHours(0));
                $scope.queryDate = new Date($scope.queryDate.setMinutes(0));
                $scope.queryDate = new Date($scope.queryDate.setSeconds(0));

                console.log("in bydate", $scope.queryDate);
                temperatureFactory.getRecordingsByDay().get({ querydate: $scope.queryDate }).$promise.then(
                    function(response) {
                        $scope.recordings = response;
                        $scope.showData = true;
                        $scope.message = '';

                        $scope.chartObject1 = {};
                        var rows = [];
                        for (var i = 0; i < $scope.recordings.length; i++) {
                            rows.push({
                                c: [{ v: new Date($scope.recordings[i].measurement_time) },
                                    { v: $scope.recordings[i].temperature.toFixed(1) },
                                    { v: $scope.recordings[i].temperature_target.toFixed(1) },
                                    { v: $scope.recordings[i].heating_state }
                                ]
                            });
                        }

                        $scope.chartObject1.type = 'LineChart';

                        $scope.chartObject1.data = {
                            'cols': cols,
                            'rows': rows
                        };

                        $scope.chartObject1.options = {
                            'title': 'MainGeyser - Daily Temperature/Heating Pattern',
                            series: {
                                0: { targetAxisIndex: 0, type: 'line', curveType: 'function' },
                                1: { targetAxisIndex: 0, type: 'line' },
                                2: { targetAxisIndex: 1, type: 'bar' }
                            },
                            vAxes: [
                                { title: 'Temperature' },
                                { title: 'Heating on/off' }
                            ]
                        };

                    },
                    /* istanbul ignore next */
                    function(response) {
                        $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
                    });

            }
        };

        $scope.tempInit = function() {
            $scope.queryDate = new Date();
        }
        $scope.selection = "last 24 hours";
        $scope.loadTemperatures();
    }]);
