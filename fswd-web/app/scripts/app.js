'use strict';

/**
 * @ngdoc overview
 * @name fridgesApp
 * @description
 * # fridgesApp
 *
 * Main module of the application.
 */

angular.module('fridgesApp', [
        'ui.router',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'googlechart',
        'config',
        // 'mp.datePicker'
        '720kb.datepicker'
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
            url: '/',
            views: {
                'header': {
                    templateUrl: 'views/header.html'
                },
                'content': {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl'
                },
                'footer': {
                    templateUrl: 'views/footer.html'
                }
            }

        })

        .state('app.energy', {
            url: 'energy',
            views: {
                'content@': {
                    templateUrl: 'views/energy.html',
                    controller: 'EnergyChartCtrl'
                }
            }
        })

        .state('app.temperature', {
            url: 'temperature',
            views: {
                'content@': {
                    templateUrl: 'views/temperature.html',
                    controller: 'TemperatureChartCtrl'
                }
            }
        })

        .state('app.settings', {
            url: 'settings',
            views: {
                'content@': {
                    templateUrl: 'views/settings.html',
                    controller: 'SettingsCtrl'
                }
            }
        });

        $urlRouterProvider.otherwise('/');
    });
