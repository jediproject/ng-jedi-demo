"use strict";

define(['angular-authService',
        'ng-currency-mask',
        'angular-ngMask',
        'angular-bootstrap',
        'angular-file-upload',
        'angular-table',
        'app-common-components'], function () {
    
    angular.module("app.external.components", [ 'authService',
                                                'ngCurrencyMask',
                                                'ngMask',
                                                'ui.bootstrap',
                                                'angularFileUpload',
                                                'angular-table' ]);

    angular.module("app.common", ['app.external.components', 'app.common.components']);
    
});