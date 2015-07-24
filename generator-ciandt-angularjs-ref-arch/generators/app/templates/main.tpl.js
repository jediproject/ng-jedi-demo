"use strict";

require.jsExtRegExp = /^app\/|^\/|:|\?|\.js$/;

require.config({
    baseUrl: "",

    // alias libraries paths.  Must set "angular"
    paths: {
        'app': 'app/app',
        'version': 'version.json',
        // main Dependencies
        'ciandt-components-utilities': 'assets/libs/ciandt-components-utilities/utilities',
        'ciandt-components-utilities-directives': 'assets/libs/ciandt-components-utilities/utilities-directives',
        'ciandt-components-utilities-filters': 'assets/libs/ciandt-components-utilities/utilities-filters',<% if (props.useI18n) {%>
        'ciandt-components-i18n': 'assets/libs/ciandt-components-i18n/i18n',<%}%>
        'ciandt-components-dialogs': 'assets/libs/ciandt-components-dialogs/dialogs',
        'ciandt-components-dialogs-ctrls': 'assets/libs/ciandt-components-dialogs/dialogs-ctrls',
        'ciandt-components-factory': 'assets/libs/ciandt-components-factory/factory',
        'ciandt-components-loading': 'assets/libs/ciandt-components-loading/loading',
        'ciandt-components-loading-directives': 'assets/libs/ciandt-components-loading/loading-directives',<% if (props.useBreadcrumb) {%>
        'ciandt-components-breadcrumb': 'assets/libs/ciandt-components-breadcrumb/breadcrumb',<%}%>
        'ciandt-components-layout': 'assets/libs/ciandt-components-layout/layout',
        'ciandt-components-layout-datepicker': 'assets/libs/ciandt-components-layout/datepicker',
        'ciandt-components-layout-input': 'assets/libs/ciandt-components-layout/input',
        'ciandt-components-layout-modal': 'assets/libs/ciandt-components-layout/modal',
        'ciandt-components-layout-panel': 'assets/libs/ciandt-components-layout/panel',
        'ciandt-components-layout-treeview': 'assets/libs/ciandt-components-layout/treeview',

        // ## Common Components
        'app-common': 'app/common/common-app',
        'app-common-env': 'app/common/env/common-env.json',
        'app-common-components': 'app/common/components/components',
        'app-common-components-exceptions': 'app/common/components/exceptions/exceptions',
        'app-common-components-navigation': 'app/common/components/navigation/navigation-directives',

        //## 3rd party angular scripts
        'angular': 'assets/libs/angular/angular',
        'angular-animate': 'assets/libs/angular-animate/angular-animate',
        'angular-authService': 'assets/libs/angular-authService/authService',
        'angular-bootstrap': 'assets/libs/angular-bootstrap/ui-bootstrap-tpls',
        'angular-cookie': 'assets/libs/angular-cookie/angular-cookie',
        'angular-file-upload': 'assets/libs/angular-file-upload/angular-file-upload',
        'angular-dynamic-locale': 'assets/libs/angular-dynamic-locale/tmhDynamicLocale',
        'angular-loading-bar': 'assets/libs/angular-loading-bar/loading-bar',
        'angular-ngMask': 'assets/libs/angular-ngMask/ngMask',
        'angular-route': 'assets/libs/angular-route/angular-route',
        'angular-table': 'assets/libs/angular-table/angular-table',
        'angularAMD': 'assets/libs/angularAMD/angularAMD',
        'ng-currency-mask': 'assets/libs/ng-currency-mask/ng-currency-mask',<% if (props.useRestangular) {%>
        'restangular': 'assets/libs/restangular/restangular',<%}%>

        //## 3rd party non angular scripts
        'bootstrap': 'assets/libs/bootstrap/bootstrap',
        'bootstrap-datetimepicker': 'assets/libs/eonasdan-bootstrap-datetimepicker/bootstrap-datetimepicker',
        'file-saver-saveas-js': 'assets/libs/file-saver-saveas-js/FileSaver',
        'jquery': 'assets/libs/jquery/jquery',
        'lodash': 'assets/libs/lodash/lodash',
        'moment': 'assets/libs/moment/moment',<% if (props.defaultLanguage != 'en') {%>
        'moment-locale': 'assets/js/moment/<%= props.defaultLanguage%>',<%}%>
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
        "bootstrap-datetimepicker": ["bootstrap", <% if (props.defaultLanguage != 'en') {%>"moment-locale"<%} else {%>"moment"<%}>],
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
        "angular-file-upload": ["angular"],<% if (props.useRestangular != 'en') {%>
        "restangular": ["lodash", "angular"],<%}%>
        "angular-loading-bar": ["angular"]<% if (props.useI18n) {%>,
        'angular-dynamic-locale': ["angular"]<%}%>
    },

    // kick start application
    deps: ["app"]
});