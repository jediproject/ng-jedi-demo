var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function (path) {
    var returnValue = path.replace(/^\/base\//, '').replace(/\.js$/, '');
    return returnValue;
};

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({
    // Karma serves files under /base, which is the basePath from your config file
    // note we are using base/src to ensure that modules are defined relative to the same path
    // for both main.js and test-main.js requireJS bootstraps
    baseUrl: '/base',

    paths: {
        // ## tests
        'test': 'test',

        // ## base
        'app': 'app/app',
        'version': 'version.json',

        // ## ng-jedi components
        'ng-jedi-utilities': 'assets/libs/ng-jedi-utilities/utilities',
        'ng-jedi-utilities-directives': 'assets/libs/ng-jedi-utilities/utilities-directives',
        'ng-jedi-utilities-filters': 'assets/libs/ng-jedi-utilities/utilities-filters',
        'ng-jedi-i18n': 'assets/libs/ng-jedi-i18n/i18n',
        'ng-jedi-dialogs': 'assets/libs/ng-jedi-dialogs/dialogs',
        'ng-jedi-dialogs-ctrls': 'assets/libs/ng-jedi-dialogs/dialogs-ctrls',
        'ng-jedi-factory': 'assets/libs/ng-jedi-factory/factory',
        'jdver': 'assets/libs/ng-jedi-factory/version',
        'ng-jedi-loading': 'assets/libs/ng-jedi-loading/loading',
        'ng-jedi-loading-directives': 'assets/libs/ng-jedi-loading/loading-directives',
        'ng-jedi-breadcrumb': 'assets/libs/ng-jedi-breadcrumb/breadcrumb',
        'ng-jedi-layout': 'assets/libs/ng-jedi-layout/layout',
        'ng-jedi-layout-datepicker': 'assets/libs/ng-jedi-layout/datepicker',
        'ng-jedi-layout-input': 'assets/libs/ng-jedi-layout/input',
        'ng-jedi-layout-modal': 'assets/libs/ng-jedi-layout/modal',
        'ng-jedi-layout-panel': 'assets/libs/ng-jedi-layout/panel',
        'ng-jedi-layout-treeview': 'assets/libs/ng-jedi-layout/treeview',
        'ng-jedi-layout-validationtooltip': 'assets/libs/ng-jedi-layout/validationtooltip',

        // ## common components
        'app-common': 'app/common/common-app',
        'app-common-env': 'app/common/env/common-env.json',
        'app-common-components': 'app/common/components/components',
        'app-common-components-exceptions': 'app/common/components/exceptions/exceptions',

        //## 3rd party angular scripts
        'angular': 'assets/libs/angular/angular',
        'angular-animate': 'assets/libs/angular-animate/angular-animate',
        'angular-authService': 'assets/libs/angular-authService/authService',
        'cryptojslib': 'assets/libs/cryptojslib/md5',
        'angular-bootstrap': 'assets/libs/angular-bootstrap/ui-bootstrap-tpls',
        'angular-cookie': 'assets/libs/angular-cookie/angular-cookie',
        'angular-file-upload': 'assets/libs/angular-file-upload/angular-file-upload',
        'angular-dynamic-locale': 'assets/libs/angular-dynamic-locale/tmhDynamicLocale',
        'angular-loading-bar': 'assets/libs/angular-loading-bar/loading-bar',
        'angular-ngMask': 'assets/libs/angular-ngMask/ngMask',
        'angular-route': 'assets/libs/angular-route/angular-route',
        'angular-table': 'assets/libs/angular-table/angular-table',
        'angularAMD': 'assets/libs/angularAMD/angularAMD',
        'ng-currency-mask': 'assets/libs/ng-currency-mask/ng-currency-mask',
        'restangular': 'assets/libs/restangular/restangular',
        'angular-toastr': 'assets/libs/angular-toastr/angular-toastr.tpls',

        //## 3rd party non angular scripts
        'bootstrap': 'assets/libs/bootstrap/bootstrap',
        'bootstrap-datetimepicker': 'assets/libs/eonasdan-bootstrap-datetimepicker/bootstrap-datetimepicker',
        'file-saver-saveas-js': 'assets/libs/file-saver-saveas-js/FileSaver',
        'jquery': 'assets/libs/jquery/jquery',
        'lodash': 'assets/libs/lodash/lodash',
        'moment': 'assets/libs/moment/moment',
        'moment-locale': 'assets/libs/moment/pt',
        'slimscroll': 'assets/libs/slimscroll/jquery.slimscroll',
        'json': 'assets/libs/requirejs-plugins/json',
        'text': 'assets/libs/requirejs-plugins/text'
    },

    // Add angular modules that does not support AMD out of the box, put it in a shim
    shim: {
        "moment-locale": ["moment"],
        "jquery": {
            exports: "$"
        },
        "slimscroll": ["jquery"],
        "bootstrap": ["jquery"],
        "bootstrap-datetimepicker": ["bootstrap", "moment-locale"],
        "angular": {
            deps: ["jquery"],
            exports: "angular"
        },
        "angular-route": ["angular"],
        "angular-animate": ["angular"],
        "angular-i18n": ["angular"],
        "angularAMD": ["angular"],
        "angular-bootstrap": ["bootstrap", "angular"],
        "angular-table": ["angular"],
        "angular-authService": ["angular"],
        "ng-currency-mask": ["angular"],
        "angular-ngMask": ["angular"],
        "angular-toastr": ["angular"],
        "angular-file-upload": ["angular"],
        "restangular": ["lodash", "angular"],
        "angular-loading-bar": ["angular"],
        'angular-dynamic-locale': ["angular"]
    },


    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff jasmine, as it is asynchronous
    callback: window.__karma__.start
});