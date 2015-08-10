"use strict";

// added to avoid concat app for all paths started with app
require.jsExtRegExp = /^app\/|^\/|:|\?|\.js$/;

require.config({
    baseUrl: "",

    paths: {
        // ## base
        'app': 'app/app.js',
        'version': 'version.json',

        // ## ng-jedi components
        'ng-jedi-utilities': 'assets/libs/ng-jedi-utilities/utilities.js',
        'ng-jedi-utilities-directives': 'assets/libs/ng-jedi-utilities/utilities-directives.js',
        'ng-jedi-utilities-filters': 'assets/libs/ng-jedi-utilities/utilities-filters.js',
        'ng-jedi-i18n': 'assets/libs/ng-jedi-i18n/i18n.js',
        'ng-jedi-dialogs': 'assets/libs/ng-jedi-dialogs/dialogs.js',
        'ng-jedi-dialogs-ctrls': 'assets/libs/ng-jedi-dialogs/dialogs-ctrls.js',
        'ng-jedi-factory': 'assets/libs/ng-jedi-factory/factory.js',
        'jdver': 'assets/libs/ng-jedi-factory/version.js.js',
        'ng-jedi-loading': 'assets/libs/ng-jedi-loading/loading.js',
        'ng-jedi-loading-directives': 'assets/libs/ng-jedi-loading/loading-directives.js',
        'ng-jedi-breadcrumb': 'assets/libs/ng-jedi-breadcrumb/breadcrumb.js',
        'ng-jedi-layout': 'assets/libs/ng-jedi-layout/layout.js',
        'ng-jedi-layout-datepicker': 'assets/libs/ng-jedi-layout/datepicker.js',
        'ng-jedi-layout-input': 'assets/libs/ng-jedi-layout/input.js',
        'ng-jedi-layout-modal': 'assets/libs/ng-jedi-layout/modal.js',
        'ng-jedi-layout-panel': 'assets/libs/ng-jedi-layout/panel.js',
        'ng-jedi-layout-treeview': 'assets/libs/ng-jedi-layout/treeview.js',
        'ng-jedi-layout-validationtooltip': 'assets/libs/ng-jedi-layout/validationtooltip.js',

        // ## common components
        'app-common': 'app/common/common-app.js',
        'app-common-env': 'app/common/env/common-env.json.js',
        'app-common-components': 'app/common/components/components.js',
        'app-common-components-exceptions': 'app/common/components/exceptions/exceptions.js',

        //## 3rd party angular scripts
        'angular': 'assets/libs/angular/angular.js',
        'angular-animate': 'assets/libs/angular-animate/angular-animate.js',
        'angular-authService': 'assets/libs/angular-authService/authService.js',
        'angular-bootstrap': 'assets/libs/angular-bootstrap/ui-bootstrap-tpls.js',
        'angular-cookie': 'assets/libs/angular-cookie/angular-cookie.js',
        'angular-file-upload': 'assets/libs/angular-file-upload/angular-file-upload.js',
        'angular-dynamic-locale': 'assets/libs/angular-dynamic-locale/tmhDynamicLocale.js',
        'angular-loading-bar': 'assets/libs/angular-loading-bar/loading-bar.js',
        'angular-ngMask': 'assets/libs/angular-ngMask/ngMask.js',
        'angular-route': 'assets/libs/angular-route/angular-route.js',
        'angular-table': 'assets/libs/angular-table/angular-table.js',
        'angularAMD': 'assets/libs/angularAMD/angularAMD.js',
        'ng-currency-mask': 'assets/libs/ng-currency-mask/ng-currency-mask.js',
        'restangular': 'assets/libs/restangular/restangular.js',

        //## 3rd party non angular scripts
        'bootstrap': 'assets/libs/bootstrap/bootstrap.js',
        'bootstrap-datetimepicker': 'assets/libs/eonasdan-bootstrap-datetimepicker/bootstrap-datetimepicker.js',
        'file-saver-saveas-js': 'assets/libs/file-saver-saveas-js/FileSaver.js',
        'jquery': 'assets/libs/jquery/jquery.js',
        'lodash': 'assets/libs/lodash/lodash.js',
        'moment': 'assets/libs/moment/moment.js',
        'moment-locale': 'assets/libs/moment/pt.js',
        'slimscroll': 'assets/libs/slimscroll/jquery.slimscroll.js',
        'json': 'assets/libs/requirejs-plugins/json.js',
        'text': 'assets/libs/requirejs-plugins/text.js'
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
        "angular-file-upload": ["angular"],
        "restangular": ["lodash", "angular"],
        "angular-loading-bar": ["angular"],
        'angular-dynamic-locale': ["angular"]
    },

    // kick start application
    deps: ["app"]
});