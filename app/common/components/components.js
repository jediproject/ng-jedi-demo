'use strict';

define(['ng-jedi-i18n',
        'ng-jedi-dialogs',
        'ng-jedi-factory',
        'ng-jedi-loading',
        'ng-jedi-breadcrumb',
        'ng-jedi-layout',
        'ng-jedi-security',
        'app-common-components-exceptions'], function () {

    angular.module('app.common.components', ['jedi.i18n',
                                             'jedi.dialogs',
                                             'jedi.factory',
                                             'jedi.loading',
                                             'jedi.breadcrumb',
                                             'jedi.layout',
                                             'jedi.security',
                                             'app.common.components.exceptions']);

});