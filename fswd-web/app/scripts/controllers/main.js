'use strict';

angular.module('fridgesApp')
    .controller('MainCtrl', ['$scope', 'latestFactory', function($scope, latestFactory) {

        $scope.showCurrent = false;
        $scope.message = 'Loading ...';
        latestFactory.getLatestRecording().query(
            function(response) {
                $scope.showCurrent = true;
                $scope.message = '';
                $scope.recording = response[0];
                // console.log(response);
            },
            /* istanbul ignore next */
            function(response) {
                $scope.message = 'Error: ' + response.status + ' ' + response.statusText;
            });

        latestFactory.getSettings({ id: "587f9ce8bb7d3d3b0a371b24" }).query(
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

            // latestFactory.getSettings().update({ id: $scope.setting._id }, $scope.setting);
            // $scope.updateForm.$setPristine();
        };



    }]);
