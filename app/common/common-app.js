"use strict";

define(['angular-input-masks',
        'angular-bootstrap',
        'angular-file-upload',
        'angular-toastr',
        'ng-jedi-i18n',
        'ng-jedi-dialogs',
        'ng-jedi-factory',
        'ng-jedi-loading',
        'ng-jedi-breadcrumb',
        'ng-jedi-layout',
        'ng-jedi-security',
        'ng-jedi-table',
        'ng-jedi-activities',        
        'app-common-components'], function () {

    angular.module("app.external.components", [ 'ui.utils.masks',
                                                'ui.bootstrap',
                                                'angularFileUpload',                                                
                                                'toastr',
                                                'jedi.i18n',
                                                'jedi.dialogs',
                                                'jedi.factory',
                                                'jedi.loading',
                                                'jedi.breadcrumb',
                                                'jedi.layout',
                                                'jedi.security',
                                                'jedi.table',
                                                'jedi.activities' ]);

    angular.module("app.common", ['app.external.components', 'app.common.components']);

});