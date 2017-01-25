exports.config = {
    allScriptsTimeout: 11000,
    specs: [
        'e2e/*.js'
    ],
    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:9000/',

    // seleniumAddress: 'http://localhost:4444/wd/hub',

    framework: 'jasmine',
    directConnect: true,

    jasmineNodeOpts: {
        defaultTimeoutInterval: 3000
    }
};
