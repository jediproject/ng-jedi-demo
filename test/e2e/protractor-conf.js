var HtmlReporter = require('protractor-html-screenshot-reporter');

exports.config = {

    seleniumAddress: 'http://localhost:4444/wd/hub',

    seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.39.0.jar',
    chromeDriver: 'node_modules/protractor/selenium/chromedriver.exe',

    // location of the Selenium JAR file and chromedriver, use these if you installed protractor locally
    // seleniumServerJar: '../node_modules/protractor/selenium/selenium-server-standalone-2.40.0.jar',
    // chromeDriver: '../node_modules/protractor/selenium/chromedriver',

    // location of your E2E test specs
    //specs: ['./*-spec.js'],

    // organize tests as suites
    suites: {
        loginpage: './common/loginpage/*-spec.js',
        donatepage: './core/donatepage/*-spec.js'
    },

    // configure multiple browsers to run tests
    capabilities: {
        'browserName': 'chrome'
    },    

    // url where your app is running, relative URLs are prepending with this URL
    baseUrl: 'http://localhost:9000/',

    // testing framework, jasmine is the default
    framework: 'jasmine',

    jasmineNodeOpts: {
        // onComplete will be called just before the driver quits.
        onComplete: null,
        // If true, display spec names.
        isVerbose: true,
        // If true, print colors to the terminal.
        showColors: true,
        // If true, include stack traces in failures.
        includeStackTrace: true,
        // Default time to wait in ms before a test fails.
        defaultTimeoutInterval: 30000
    },

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    //baseUrl: 'http://localhost:9999',

    // Selector for the element housing the angular app - this defaults to
    // body, but is necessary if ng-app is on a descendant of
    rootElement: 'body',

    onPrepare: function () {
        
        // Add a reporter and store screenshots to `screnshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'test/e2e/protractor-result'
        }));
    },
};
