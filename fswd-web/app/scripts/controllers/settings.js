'use strict';

angular.module('fridgesApp')
    .controller('SettingsCtrl', ['$scope', 'settingsFactory', function($scope, settingsFactory) {

        $scope.showCurrent = false;
        $scope.message = 'Loading ...';

        settingsFactory.getSettings({ id: "587f9ce8bb7d3d3b0a371b24" }).query(
            function(response) {
                $scope.showCurrent = true;
                $scope.message = '';
                $scope.setting = response[0];
                // console.log(response);
            },
            /* istanbul ignore next */
            function(response) {
                $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
            });

        $scope.submitChanges = function() {
            console.log($scope.setting);

            // settingsFactory.getSettings().update({ _id: $scope.setting._id }, $scope.setting);
        };



    }]);
