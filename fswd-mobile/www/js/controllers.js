angular.module('starter.controllers', [])

.controller('HomeCtrl', ['$scope', 'latestFactory', 'settingFactory',
    function($scope, latestFactory, settingFactory) {
        var promise = latestFactory.get();
        promise.then(function(_response) {
            $scope.recording = _response.data[0];
            var promise2 = settingFactory.get("587f9ce8bb7d3d3b0a371b24");
            promise2.then(function(_response2) {
                $scope.setting = _response2.data;
            });
        });

        $scope.submitChanges = function() {
            settingsFactory.getSettings().update({ _id: $scope.setting._id }, $scope.setting);
        };


    }
])

.controller('SettingsCtrl', ['$scope', 'settingFactory', function($scope, settingFactory) {
    var promise = settingFactory.get("587f9ce8bb7d3d3b0a371b24");
    promise.then(function(_response) {
        console.debug(" The setting data " + JSON.stringify(_response.data));
        $scope.setting = _response.data;
        console.log($scope.setting);
    });

    $scope.submitChanges = function() {
        console.log($scope.setting);

        settingsFactory.getSettings().update({ _id: $scope.setting._id }, $scope.setting);
    };
}])

.controller('TempCtrl', ['$scope', 'tempFactory', function($scope, tempFactory) {
    var cols = [
        { id: 'x', label: 'Date', type: 'datetime' },
        { id: 's', label: 'Temperature', type: 'number' },
        { id: 's', label: 'Desired Temp', type: 'number' },
        { id: 's', label: 'Heating', type: 'number' }
    ];

    $scope.change = function(newSelection) {
        if (newSelection == "last24") {
            var promise = tempFactory.getToday();
            promise.then(function(_response) {
                $scope.recordings = _response.data;

                $scope.chartObject = {};
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

                $scope.chartObject.type = 'LineChart';

                $scope.chartObject.data = {
                    'cols': cols,
                    'rows': rows
                };

                $scope.chartObject.options = {
                    'title': 'MainGeyser - Last 24 hours',
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
            });
        } else {
            console.log("at date", $scope.atDate);
            var promise2 = tempFactory.getAtDate($scope.atDate);
            promise2.then(function(_response) {
                console.log(" The recording data " + JSON.stringify(_response.data));
                $scope.recordingsAtDate = _response.data;
                $scope.chartObject = {};
                var rows = [];
                for (var i = 0; i < $scope.recordingsAtDate.length; i++) {
                    rows.push({
                        c: [{ v: new Date($scope.recordingsAtDate[i].measurement_time) },
                            { v: $scope.recordingsAtDate[i].temperature.toFixed(1) },
                            { v: $scope.recordingsAtDate[i].temperature_target.toFixed(1) },
                            { v: $scope.recordingsAtDate[i].heating_state }
                        ]
                    });
                }

                $scope.chartObject.type = 'LineChart';

                $scope.chartObject.data = {
                    'cols': cols,
                    'rows': rows
                };

                $scope.chartObject.options = {
                    'title': 'MainGeyser - Specific Date',
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
            });
        }
    };
    $scope.selection = "last24";
    $scope.atDate = new Date();
    $scope.$watch("selection", function() {
        $scope.change('last24');
    });
}])


.controller('EnergyCtrl', ['$scope', 'energyFactory', function($scope, energyFactory) {
    var cols = [
        { id: 'x', label: 'Date', type: 'date' },
        { id: 's', label: 'Energy', type: 'number' }
    ];

    $scope.change = function(newSelection) {
        if (newSelection == "daily") {
            var promise = energyFactory.getLast30();
            promise.then(function(_response) {
                $scope.energy = _response.data;
                $scope.chartObject = {};
                var rows = [];
                for (var i = 0; i < $scope.energy.length; i++) {
                    rows.push({
                        c: [{ v: new Date($scope.energy[i]._id.date) },
                            { v: $scope.energy[i].daily_energy.toFixed(1) }
                        ]
                    });
                }

                $scope.chartObject.type = 'LineChart';

                $scope.chartObject.data = {
                    'cols': cols,
                    'rows': rows
                };

                $scope.chartObject.options = {
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
            });
        } else {
            var promise2 = energyFactory.getWeekly();
            promise2.then(function(_response) {

                $scope.weekly = _response.data;
                $scope.chartObject = {};

                var rows = [];
                for (var i = 0; i < $scope.weekly.length; i++) {
                    rows.push({
                        c: [{ v: new Date($scope.weekly[i].week_start) },
                            { v: $scope.weekly[i].weekly_energy.toFixed(1) }
                        ]
                    });
                }

                $scope.chartObject.type = 'LineChart';
                $scope.chartObject.data = {
                    'cols': cols,
                    'rows': rows
                };
                $scope.chartObject.options = {
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
            });

        }
    };
    $scope.selection = "daily";
    $scope.$watch("selection", function() {
        $scope.change('daily');
    });
}])

.controller('ChatsCtrl', function($scope, Chats) {
    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
