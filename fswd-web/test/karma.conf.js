// Karma configuration
// Generated on 2016-04-04

module.exports = function(config) {
    'use strict';

    config.set({
        // add to list of reporters
        reporters: ['progress', 'coverage'],


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        // as well as any additional frameworks (requirejs/chai/sinon/...)
        frameworks: [
            'jasmine'
        ],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'bower_components/angular/angular.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/angular-touch/angular-touch.js',
            'bower_components/angular-google-chart/ng-google-chart.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angularjs-datepicker/dist/angular-datepicker.min.js',
            'bower_components/angular-mocks/angular-mocks.js',
            // endbower
            'app/scripts/**/*.js',
            'test/mock/**/*.js',
            'test/spec/**/*.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'PhantomJS'
        ],

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-coverage',
            'karma-jshint-preprocessor'
        ],

        // add to list of preprocesssors
        preprocessors: {
            'app/scripts/controllers/*.js': ['jshint', 'coverage'],
            'app/scripts/*.js': ['jshint', 'coverage']
            // 'app/scripts/app.js': ['coverage']
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        colors: true,

        // add plugin settings
        coverageReporter: {
            // specify a common output directory
            // type : 'text'
            dir: 'reports/coverage',
            reporters: [
                { type: 'text' },
                { type: 'html', subdir: 'report-html' }
                // }
            ]
        },

        // add plugin settings
        junitReporter: {
            // location of results output file
            outputFile: 'test-results/junit-results.xml'
        },

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        // urlRoot: '_karma_'
    });
};
