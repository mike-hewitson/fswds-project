'use strict';

/**
 * @ngdoc function
 * @name fridgesApp.controller:MainCtrl
 * @description
 * # HistoryCtrl
 * Controller of the fridgesApp
 */
angular.module('fridgesApp')
    .controller('EnergyChartCtrl', ['$scope', 'energyFactory', function($scope, energyFactory) {

        $scope.selection = "daily";

        $scope.loadEnergy = function() {
            $scope.showData = false;
            $scope.message = 'Loading ...';

            var cols = [
                { id: 'x', label: 'Date', type: 'date' },
                { id: 's', label: 'Energy', type: 'number' }
            ];

            if ($scope.selection == "daily") {
                energyFactory.getEnergyDaily().get().$promise.then(
                    function(response) {
                        $scope.summary = response;
                        $scope.showData = true;
                        $scope.message = '';
                        // console.log(response);

                        $scope.chartObject1 = {};
                        var rows = [];
                        for (var i = 0; i < $scope.summary.length; i++) {
                            rows.push({
                                c: [{ v: new Date($scope.summary[i]._id.date) },
                                    { v: $scope.summary[i].daily_energy.toFixed(1) }
                                ]
                            });
                        }

                        $scope.chartObject1.type = 'LineChart';

                        $scope.chartObject1.data = {
                            'cols': cols,
                            'rows': rows
                        };

                        $scope.chartObject1.options = {
                            'title': 'MainGeyser - Daily Energy Use',
                            curveType: 'function',
                            smoothLine: true,
                            series: {
                                0: { targetAxisIndex: 0, type: 'line' }
                            },
                            vAxes: [
                                { title: 'KW Hours' }
                            ]
                        };

                    },
                    /* istanbul ignore next */
                    function(response) {
                        $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
                    });
            } else {
                energyFactory.getEnergyWeekly().get().$promise.then(
                    function(response) {
                        $scope.summary = response;
                        $scope.showData = true;
                        $scope.message = '';
                        // console.log(response);

                        $scope.chartObject1 = {};
                        var rows = [];
                        for (var i = 0; i < $scope.summary.length; i++) {
                            rows.push({
                                c: [{ v: new Date($scope.summary[i].week_start) },
                                    { v: $scope.summary[i].weekly_energy.toFixed(1) }
                                ]
                            });
                        }

                        $scope.chartObject1.type = 'LineChart';

                        $scope.chartObject1.data = {
                            'cols': cols,
                            'rows': rows
                        };

                        $scope.chartObject1.options = {
                            'title': 'MainGeyser - Weekly Energy Use',
                            curveType: 'function',
                            smoothLine: true,
                            series: {
                                0: { targetAxisIndex: 0, type: 'line' }
                            },
                            vAxes: [
                                { title: 'KW Hours' }
                            ]
                        };

                    },
                    /* istanbul ignore next */
                    function(response) {
                        $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
                    });

            }
        };

        $scope.loadEnergy();


    }]);
